import { Router }from 'express'

export const balanceRouter = Router();

balanceRouter.get("/", async (req, res) => {    
    res.json({});
});