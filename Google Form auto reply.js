function sendAutomaticReply() {
  var formId = '13Gn_kPJYf2T7zlgt3GmIcoppEaREA3d9vOXOxyjmzHE'; // Replace with your form ID
  var templateSubject = 'Job Application Received';
  var templateBody = "<p>Dear {{First Name}},</p>"
      + "<p>Thank you for submitting your application for {{Which position are you interested in?}} at Ruby Red. We have received it and will review it carefully. "
      + "If your profile matches our criteria, we will contact you for an interview.</p>"
      + "<p>In the meantime, we encourage you to learn more about our company and our mission. "
      + "You can visit our website at <a href='https://ruby-red-tech.netlify.app'>Ruby Red</a> to gain a better understanding of our values, services, and culture.</p>"
      + "<p>Best Regards,<br>"
      + "Recruitment Officer</p>"
      + "<img src='https://i.imgur.com/uRGThng.png' alt='Company Logo' width='150' height='100'>"; // Replace the URL with the actual URL of your company logo image

  var form = FormApp.openById(formId);
  var responses = form.getResponses();
  var scriptProperties = PropertiesService.getScriptProperties();
  var processedResponseIds = scriptProperties.getProperty('processedResponseIds');

  if (!processedResponseIds) {
    processedResponseIds = [];
  } else {
    processedResponseIds = JSON.parse(processedResponseIds);
  }

  for (var i = 0; i < responses.length; i++) {
    var response = responses[i];
    var responseId = response.getId();

    if (processedResponseIds.includes(responseId)) {
      continue; // Skip processing if the response has already been processed
    }

    var recipientEmail = response.getRespondentEmail();
    var itemResponses = response.getItemResponses();
    var firstName = '';
    var positionInterestedIn = '';

    for (var j = 0; j < itemResponses.length; j++) {
      var itemResponse = itemResponses[j];
      var question = itemResponse.getItem().getTitle();
      var answer = itemResponse.getResponse();

      if (question === 'First Name') {
        firstName = answer;
      }
      if (question === 'Email') { // Ensure the email question title matches
        recipientEmail = answer; // Update the recipient email
      }
      if (question === 'Which position are you interested in?') {
        positionInterestedIn = answer;
      }
    }

    var subject = templateSubject;
    var body = templateBody.replace('{{First Name}}', firstName)
                           .replace('{{Which position are you interested in?}}', positionInterestedIn);

    MailApp.sendEmail({
      to: recipientEmail,
      subject: subject,
      htmlBody: body
    });

    processedResponseIds.push(responseId);
  }

  scriptProperties.setProperty('processedResponseIds', JSON.stringify(processedResponseIds));
}
