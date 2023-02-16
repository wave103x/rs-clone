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
      console.log('запись есть');
      if (existedWinner.score > score) {
        console.log('счет меньше');
        const newWinner = await winner.update(
          {
            score, time, aliveCells,
          },
          { where: { userId: id, mode } },
        );

        res.status(201)
          .json(newWinner);
      }
      if (existedWinner.score === score) {
        console.log('счет равен');
        if (existedWinner.aliveCells < aliveCells) {
          console.log('но клеток у нового победителя выжило больше');
          const newWinner = await winner.update(
            {
              score, time, aliveCells,
            },
            { where: { userId: id, mode } },
          );
          return res.status(201)
            .json(newWinner);
        }
      }
    } else {
      console.log('записи нет, создаем новую');
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
      console.log('req.params есть', mode);
      const allWinners = await winner.findAll({
        where: { mode },
        order: [
          ['score', 'DESC'],
          ['alive_cells', 'ASC'],
        ],
      });
      console.log(allWinners);
      return res.status(201)
        .json(allWinners);
    } if (mode === 'all') {
      const allWinners = await winner.findAll({
        order: [
          ['score', 'DESC'],
          ['alive_cells', 'ASC'],
        ],
      });
      console.log(allWinners);
      return res.status(201)
        .json(allWinners);
    }
    // const allWinners = await winner.findAll();
    // console.log(allWinners);
    // return res.status(201)
    //   .json(allWinners);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
};

module.exports = { postWinner, getWinners };
