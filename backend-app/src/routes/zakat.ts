import { Router } from "express";
import { ZakatCalculation } from "../types/zakat";

const router = Router();

router.get("/", (req, res) => {
  const example: ZakatCalculation = {
    wealth: 10000,
    liabilities: 2000,
    zakatDue: 200
  };
  res.json(example);
});

router.post("/", (req, res) => {
  const { wealth, liabilities, goldPricePerGram } = req.body;
  const zakatDue = ((wealth - liabilities) * 0.025);
  const result: ZakatCalculation = {
    wealth,
    liabilities,
    zakatDue
  };
  res.json(result);
});

export default router;