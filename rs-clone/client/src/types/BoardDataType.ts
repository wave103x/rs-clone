type BoardDataType = {
  length: number;
  ships: {
    [index: string]: number[];
    four: number[];
    triple: number[];
    double: number[];
    single: number[];
  };
};

export default BoardDataType;
