"""
Services package for Nisab Wisdom AI
Contains AI services and external API integrations
"""

from .deepseek_client import deepseek_client
from .islamic_finance_ai import islamic_finance_ai

__all__ = [
    "deepseek_client",
    "islamic_finance_ai"
]