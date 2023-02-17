const { winner } = require('../../db/models');
const { user } = require('../../db/models');

const postWinner = async (req, res) => {
  const {
    score, time, aliveCells, mode,
  } = req.body;
  const { id } = req.params;

  try {
    const existedWinner = await winner.findOne({
      where: { userId: Number(id), mode },
    });
    console.log('here', existedWinner);
    if (existedWinner) {
      if (existedWinner.score > Number(score)) {
        console.log('счет меньше');
        const newWinner = await winner.update(
          {
            score, time, aliveCells,
          },
          { where: { userId: id, mode } },
        );
        const updatedWinner = await winner.findOne({
          where: { userId: Number(id), mode },
        });
        return res.status(201)
          .json(updatedWinner);
      } if (existedWinner.score === Number(score)) {
        if (existedWinner.aliveCells < Number(aliveCells)) {
          const newWinner = await winner.update(
            {
              score, time, aliveCells,
            },
            { where: { userId: id, mode } },
          );
          const updatedWinner = await winner.findOne({
            where: { userId: Number(id), mode },
          });
          console.log(updatedWinner);
          return res.status(201)
            .json(updatedWinner);
        }
      }
      res.sendStatus(400);
    } else {
      const newWinner = winner.create({
        userId: id, score, time, aliveCells, mode,
      });

      return res.status(201)
        .json(newWinner);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
};

const getWinners = async (req, res) => {
  const { mode } = req.params;
  try {
    if (mode === 'fff' || mode === 'sss') {
      const allWinners = await winner.findAll({
        where: { mode },
        order: [
          ['score', 'DESC'],
          ['alive_cells', 'ASC'],
        ],
      });
      return res.status(201)
        .json(allWinners);
    } if (mode === 'all') {
      const allWinners = await winner.findAll({
        order: [
          ['score', 'DESC'],
          ['alive_cells', 'ASC'],
        ],
      });
      return res.status(201)
        .json(allWinners);
    }
    res.sendStatus(400);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
};

module.exports = { postWinner, getWinners };
