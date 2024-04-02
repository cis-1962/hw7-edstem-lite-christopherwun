// The Question model should base on the schema with the following attributes

// questionText which is of type String
// answer which is of type String
// author which is of type String

import mongoose from 'mongoose';
const { Schema } = mongoose;

interface IQuestion {
  questionText: string;
  answer: string;
  author: string;
}

const questionSchema = new Schema<IQuestion>({
  questionText: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});

const Question = mongoose.model('Question', questionSchema);

export default Question;