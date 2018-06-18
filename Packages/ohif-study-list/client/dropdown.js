import { Meteor } from 'meteor/meteor';
import { OHIF } from 'meteor/ohif:core';

Meteor.startup(() => {
    OHIF.studylist.dropdown = new OHIF.ui.Dropdown();

    OHIF.studylist.dropdown.setItems([{
        action: OHIF.studylist.viewSeriesDetails,
        text: 'View Series Details',
        disabled: true,
    }, {
        text: 'Anonymize',
        disabled: true
    }, {
        text: 'Send',
        action: OHIF.studylist.shareSelectedStudies,
        separatorAfter: true
    }, {
        text: 'Delete',
        action: OHIF.studylist.deleteStudies,
    }, {
        action: OHIF.studylist.exportSelectedStudies,
        text: 'Export',
        title: 'Export Selected Studies'
    }]);
});
