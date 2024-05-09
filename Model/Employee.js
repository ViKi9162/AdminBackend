import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const employeeSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  mobileNo: {
    type: String,
    required: true
  },
  tempa: {
    type: String,
    default: ''
  },
  designation: {
    type: String,
    enum: ['HR', 'Manager', 'Sale']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female']
  },
  courses: {
    type: [String],
    enum: ['MCA', 'BCA', 'BSC']
  },
  image: {
    data: Buffer, // binary data of the image
    contentType: String // MIME type of the image
  }
},{timestamps:true});

export default model('Employee', employeeSchema);
