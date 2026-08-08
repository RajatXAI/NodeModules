const fs = require("fs");
const { pipeline } = require("stream");

const source = fs.createReadStream("./input/movie.mp4");

const destination = fs.createWriteStream("./output/movie-copy.mp4");

console.log("Copy Started...");

pipeline(
  source,

  destination,

  (error) => {
    if (error) {
      console.log("Copy Failed");

      console.log(error.message);

      return;
    }

    console.log("Copy Completed Successfully");
  },
);
