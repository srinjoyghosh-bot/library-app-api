
const Student = require("../model/student");

const throwError = (err, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
};

exports.findStudent = async (req, res, next) => {
  const id = req.body.id;
  try {
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({
        message: "Student not found!",
      });
    }
    res.status(200).json({
      message: "Student found!",
      student: student,
    });
  } catch (error) {
    throwError(error, next);
  }
};

exports.addStudent = async (req, res, next) => {
  const enrollment = req.body.id;
  const name = req.body.name;
  const branch = req.body.branch;
  const degree = req.body.degree;
  const year = req.body.year;
  const image = req.body.image;
  try {
    const [student, created] = await Student.findOrCreate({
      where: {
        enrollment_id: enrollment,
      },
      defaults: {
        name: name,
        branch: branch,
        degree: degree,
        year: year,
        image_url: image,
      },
    });
    if (created) {
      return res.status(200).json({
        message: "Student created",
        student: student,
      });
    }
    res.status(200).json({
      message: "Student already created",
      student: student,
    });
  } catch (error) {
    throwError(error, next);
  }
};
