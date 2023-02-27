type TWinnerObj = {
  userId:number;
  score: number,
  time: number,
  aliveCells: number,
  mode: string,
  user?: {
    nickName: string,
  }
}

export default TWinnerObj;