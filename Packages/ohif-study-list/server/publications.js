import { Meteor } from 'meteor/meteor';
import { OHIF } from 'meteor/ohif:core';

Meteor.publish('studyImportStatus', () => OHIF.studylist.collections.StudyImportStatus.find());


Meteor.publish("allUserData", function () {
    return Meteor.users.find({}, {fields: {'nested.things': 1}});
});
