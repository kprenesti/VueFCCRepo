const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  }, //will be a select list
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  githubUserName: {
    type: String
  },
  experience: [{
    title: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    location: {
      type: String
    },
    from: {
      type: Date,
      required: true
    },
    to: {
      type: Date
    },
    current: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      required: true,
      min: 40
    }
  }],
  education: [{
    school: {
      type: String,
      required: true
    },
    location: {
      type: String
    },
    from: {
      type: Date,
      required: true
    },
    to: {
      type: Date
    },
    graduated: {
      type: Boolean,
      default: false
    },
    degree: {
      type: String
    },
    description: {
      type: String
    }
  }],
  social: [{
    youtube: {
      type: String
    },
    facebook: {
      type: String
    },
    twitter: {
      type: String
    },
    linkedin: {
      type: String
    },
    github: {
      type: String
    }
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

const Profile = mongoose.model('profile', ProfileSchema);
module.exports = Profile;