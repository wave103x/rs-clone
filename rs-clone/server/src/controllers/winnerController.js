/* eslint-disable no-else-return */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const { winner } = require("../../db/models");
const { user } = require("../../db/models");

const postWinner = async (req, res) => {
  const { score, time, aliveCells, mode } = req.body;
  const { id } = req.params;
  try {
    const existedWinner = await winner.findOne({
      where: { userId: Number(id), mode },
    });
    if (existedWinner) {
      if (existedWinner.score > Number(score)) {
        const newWinner = await winner.update(
          {
            score,
            time,
            aliveCells,
          },
          { where: { userId: id, mode } }
        );
        const updatedWinner = await winner.findOne({
          where: { userId: Number(id), mode },
        });
        return res.status(201).json(updatedWinner);
      } else if (existedWinner.score === Number(score)) {
        if (existedWinner.aliveCells < Number(aliveCells)) {
          const newWinner = await winner.update(
            {
              score,
              time,
              aliveCells,
            },
            { where: { userId: id, mode } }
          );
          const updatedWinner = await winner.findOne({
            where: { userId: Number(id), mode },
          });
          return res.status(201).json(updatedWinner);
        }
      }
      return res.status(201).json(existedWinner);
    } else {
      const newWinner = await winner.create({
        userId: id,
        score,
        time,
        aliveCells,
        mode,
      });

      return res.status(201).json(newWinner);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(404);
  }
};

const getWinners = async (req, res) => {
  const { mode } = req.params;
  try {
    if (mode === "solo" || mode === "online") {
      const allWinners = await winner.findAll({
        where: { mode },
        order: [
          ["score", "ASC"],
          ["alive_cells", "DESC"],
        ],
        include: [{
          model: user,
          attributes: ['nickName'],
        }],
      });
      return res.status(201).json(allWinners);
    }
    if (mode === "all") {
      const allWinners = await winner.findAll({
        order: [
          ["score", "ASC"],
          ["alive_cells", "DESC"],
        ],
        include: [{
          model: user,
          attributes: ['nickName'],
        }],
      });
      return res.status(201).json(allWinners);
    }
    res.sendStatus(400);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
};

module.exports = { postWinner, getWinners };
