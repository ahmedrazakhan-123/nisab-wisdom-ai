# Production-ready database configuration with security
from sqlalchemy import create_engine, MetaData, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool
from sqlalchemy.engine import Engine
import sqlite3
from contextlib import contextmanager
from typing import Generator
from app.config import settings
import structlog

logger = structlog.get_logger()

# Database Models Base
Base = declarative_base()

# Naming convention for consistent constraint names
convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)
Base.metadata = metadata

class DatabaseManager:
    """
    Secure database manager with connection pooling and security controls
    """
    
    def __init__(self):
        self.engine = None
        self.SessionLocal = None
        self._setup_database()
    
    def _setup_database(self):
        """Setup database with security configurations"""
        
        # Database URL validation
        if not settings.database_url:
            raise ValueError("DATABASE_URL must be configured")
        
        # Engine configuration with security settings
        engine_kwargs = {
            "echo": settings.debug,  # Only log SQL in debug mode
            "future": True,  # Use SQLAlchemy 2.0 style
        }
        
        if settings.database_url.startswith("postgresql"):
            # PostgreSQL production configuration
            engine_kwargs.update({
                "poolclass": QueuePool,
                "pool_size": settings.database_pool_size,
                "max_overflow": settings.database_max_overflow,
                "pool_pre_ping": True,  # Verify connections before use
                "pool_recycle": 3600,   # Recycle connections every hour
                "connect_args": {
                    "sslmode": "require" if settings.environment == "production" else "prefer",
                    "application_name": "nisab_wisdom_ai",
                    "connect_timeout": 10,
                    "command_timeout": 30,
                    "options": "-c default_transaction_isolation=read_committed"
                }
            })
        elif settings.database_url.startswith("sqlite"):
            # SQLite configuration (for development/testing)
            engine_kwargs.update({
                "connect_args": {
                    "check_same_thread": False,
                    "timeout": 20,
                    "isolation_level": None  # Enable autocommit mode
                }
            })
        
        # Create engine
        self.engine = create_engine(settings.database_url, **engine_kwargs)
        
        # Setup session factory
        self.SessionLocal = sessionmaker(
            bind=self.engine,
            autocommit=False,
            autoflush=False,
            expire_on_commit=False
        )
        
        # Setup security event listeners
        self._setup_security_listeners()
        
        logger.info(
            "Database configured", 
            url=settings.database_url.split("@")[-1],  # Hide credentials
            environment=settings.environment
        )
    
    def _setup_security_listeners(self):
        """Setup database security event listeners"""
        
        @event.listens_for(self.engine, "connect")
        def set_sqlite_pragma(dbapi_connection, connection_record):
            """Set SQLite security pragmas"""
            if isinstance(dbapi_connection, sqlite3.Connection):
                cursor = dbapi_connection.cursor()
                # Enable foreign key constraints
                cursor.execute("PRAGMA foreign_keys=ON")
                # Set secure delete mode
                cursor.execute("PRAGMA secure_delete=ON") 
                # Set journal mode for better concurrency
                cursor.execute("PRAGMA journal_mode=WAL")
                # Set synchronous mode for data integrity
                cursor.execute("PRAGMA synchronous=FULL")
                cursor.close()
        
        @event.listens_for(self.engine, "before_cursor_execute")
        def log_sql_queries(conn, cursor, statement, parameters, context, executemany):
            """Log SQL queries for security monitoring"""
            if settings.debug:
                logger.debug(
                    "SQL Query",
                    statement=statement[:200],  # Truncate long queries
                    parameters=str(parameters)[:100] if parameters else None
                )
        
        @event.listens_for(self.engine, "handle_error")
        def handle_db_errors(exception_context):
            """Log database errors for security monitoring"""
            logger.error(
                "Database error",
                error=str(exception_context.original_exception),
                statement=exception_context.statement[:200] if exception_context.statement else None
            )
    
    @contextmanager
    def get_db_session(self) -> Generator[Session, None, None]:
        """
        Get database session with proper error handling
        """
        session = self.SessionLocal()
        try:
            yield session
            session.commit()
        except Exception as e:
            session.rollback()
            logger.error("Database session error", error=str(e))
            raise
        finally:
            session.close()
    
    def create_tables(self):
        """Create all database tables"""
        try:
            Base.metadata.create_all(bind=self.engine)
            logger.info("Database tables created successfully")
        except Exception as e:
            logger.error("Failed to create database tables", error=str(e))
            raise
    
    def health_check(self) -> bool:
        """Check database health"""
        try:
            with self.get_db_session() as session:
                session.execute("SELECT 1")
            return True
        except Exception as e:
            logger.error("Database health check failed", error=str(e))
            return False

# Global database manager
db_manager = DatabaseManager()

# FastAPI dependency for database sessions
def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency for database sessions"""
    with db_manager.get_db_session() as session:
        yield session

# Database models for the application
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Numeric
from sqlalchemy.sql import func
import uuid

class User(Base):
    """User model with security considerations"""
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    failed_login_attempts = Column(Integer, default=0, nullable=False)
    last_login_attempt = Column(DateTime(timezone=True), nullable=True)
    last_successful_login = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"

class ZakatCalculation(Base):
    """Store zakat calculations for audit purposes"""
    __tablename__ = "zakat_calculations"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=True)  # Anonymous calculations allowed
    
    # Input data (encrypted in production)
    cash_in_hand = Column(Numeric(15, 2), nullable=False)
    cash_in_bank = Column(Numeric(15, 2), nullable=False)
    gold_in_grams = Column(Numeric(10, 3), nullable=False)
    silver_in_grams = Column(Numeric(10, 3), nullable=False)
    investments = Column(Numeric(15, 2), nullable=False)
    business_assets = Column(Numeric(15, 2), nullable=False)
    property_for_trading = Column(Numeric(15, 2), nullable=False)
    loans = Column(Numeric(15, 2), nullable=False)
    bills = Column(Numeric(15, 2), nullable=False)
    wages = Column(Numeric(15, 2), nullable=False)
    currency = Column(String(3), nullable=False)
    held_for_one_year = Column(Boolean, nullable=False)
    
    # Calculated results
    total_assets = Column(Numeric(15, 2), nullable=False)
    total_liabilities = Column(Numeric(15, 2), nullable=False)
    net_wealth = Column(Numeric(15, 2), nullable=False)
    nisab_threshold = Column(Numeric(15, 2), nullable=False)
    meets_nisab = Column(Boolean, nullable=False)
    zakat_due = Column(Numeric(15, 2), nullable=False)
    
    # Market data used
    gold_price_per_gram = Column(Numeric(10, 4), nullable=False)
    silver_price_per_gram = Column(Numeric(10, 4), nullable=False)
    
    # Audit fields
    client_ip = Column(String(45), nullable=True)  # IPv6 support
    user_agent = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<ZakatCalculation(id={self.id}, zakat_due={self.zakat_due})>"

class APIKey(Base):
    """API key management"""
    __tablename__ = "api_keys"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    key_hash = Column(String(255), unique=True, nullable=False)  # Hashed API key
    name = Column(String(100), nullable=False)
    user_id = Column(String(36), nullable=False)
    permissions = Column(Text, nullable=True)  # JSON string
    is_active = Column(Boolean, default=True, nullable=False)
    last_used = Column(DateTime(timezone=True), nullable=True)
    usage_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=True)

# Export database components
__all__ = [
    "db_manager",
    "get_db",
    "Base",
    "User",
    "ZakatCalculation", 
    "APIKey"
]