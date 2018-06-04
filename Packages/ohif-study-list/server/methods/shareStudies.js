import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { OHIF } from 'meteor/ohif:core';

console.log('loading the methods');

Meteor.methods({
    'studyList.shareStudies'(username, studies) {
        console.log(username);
        console.log(studies);

        studies.forEach((study) => {
            KHEOPS.shareStudyWithUser(study, username);
        });
    },

    'studyList.deleteStudies'(studies) {
        studies.forEach((study) => {
            KHEOPS.deleteStudy(study);
        });
    },
});
