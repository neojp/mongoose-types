var mongoose = require('mongoose')
  , ObjectID = mongoose.ObjectID
  , BinaryParser = mongoose.mongo.BinaryParser;

exports.useTimestamps = function (schema, options) {
  if (schema.path('_id')) {
    schema.add({
      updatedAt: Date
    });
    schema.virtual('created_at')
      .get( function () {
        if (this._created_at) return this._created_at;
        var unixtime = BinaryParser.decodeInt(this._id.id.slice(0, 4), 32, true, true);
        return this._created_at = new Date(unixtime * 1000);
      });
    schema.pre('save', function (next) {
      if (this.isNew) {
        this.updated_at = this.created_at;
      } else {
        this.updated_at = new Date;
      }
      next();
    });
  } else {
    schema.add({
        created_at: Date
      , updated_at: Date
    });
    schema.pre('save', function (next) {
      if (!this.created_at) {
        this.created_at = this.updated_at = new Date;
      } else {
        this.updated_at = new Date;
      }
      next();
    });
  }
};
