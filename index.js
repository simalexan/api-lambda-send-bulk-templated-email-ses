const AWS = require('aws-sdk'),
  SES = new AWS.SES(),
  processResponse = require('./process-response.js'),
  FROM_EMAIL = process.env.FROM_EMAIL,
  TEMPLATE_NAME = process.env.TEMPLATE_NAME;

exports.handler = (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return Promise.resolve(processResponse(true));
  }

  if (!event.body) {
    return Promise.resolve(processResponse(true, 'Please specify the required parameters: emailGroups, and defaultTemplateData', 400));
  }
  const emailData = JSON.parse(event.body);

  if (!emailData.emailGroups || !Array.isArray(emailData.emailGroups) || !emailData.defaultTemplateData) {
    return Promise.resolve(processResponse(true, 'Please specify the required parameters: emailGroups, and defaultTemplateData', 400));
  }

  const invalidEmailGroups = emailData.emailGroups.filter(emailGroup => {
    return !emailGroup.toEmails || !emailGroup.templateData;
  });

  if (invalidEmailGroups.length > 0) {
    return Promise.resolve(processResponse(true, 'Please, all of the email groups must have the toEmails', 400)); 
  }

  const destinations = emailData.emailGroups.map(emailGroup => {
    return {
      Destination: {
        ToAddresses: emailGroup.toEmails,
        CcAddresses: emailGroup.ccEmails || []
      },
      ReplacementTemplateData: emailGroup.templateData || ''
    }
  });

  const emailParams = {
    Destinations: destinations,
    Template: TEMPLATE_NAME,
    DefaultTemplateData: emailData.defaultTemplateData,
    Source: FROM_EMAIL
  };

  if (emailData.replyToEmails && Array.isArray(emailData.replyToEmails)) {
    emailParams.ReplyToAddresses = emailData.replyToEmails;
  }

  return SES.sendBulkTemplatedEmail(emailParams).promise()
    .then(() => (processResponse(true)))
    .catch(err => {
      console.error(err, err.stack);
      const errorResponse = `Error: Execution of sendBulkTemplatedEmail caused an SES error, please look at your logs.`;
      return processResponse(true, errorResponse, 500);
    });
};