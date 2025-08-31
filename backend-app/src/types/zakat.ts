import { Router } from "express";
import { ZakatCalculation } from "./zakat";

const router = Router();

router.get("/", (req, res) => {
  // Example response
  const example: ZakatCalculation = {
    wealth: 10000,
    liabilities: 2000,
    zakatDue: 200
  };
  res.json(example);
});

export default router;

export interface ZakatCalculation {
  wealth: number;
  liabilities: number;
  zakatDue: number;
}