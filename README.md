
# Api Gateway -> Lambda (Send Bulk Templated Email) -> SES (Simple Email Service)

## Description

This is a serverless component consisting of:

- an Api Gateway, with a POST `/send-bulk-template` endpoint, that requires two parameters: `emailGroups`, and `defaultTemplateData`. It also accepts one optional paramter `replyToEmails`. The `emailGroups` parameter must be an array of objects, which represent the SES Email Destinations, as in the following structure:

  - `toEmails`, required, represents an array of email addresses to which you want to send the templated email to.
  - `templateData`, optional, represents the data with which you want to replace your template placeholders.
  - `ccEmails`, optional, represents an array of email addresses to which you also want to send this templated email to.

- a Lambda, that sends a Bulk Templated email to many grouped email addresses. It takes the `TemplateName` from the initial CloudFormation deployment, which must be a valid and existing SES Template. It also needs the `FromEmail` parameter from the initial CloudFormation deployment, the verified email used to specify the source from which the emails are sent.

If you're interested to read more about the specifics of the AWS SES send bulk templated email functionality, check out the [AWS SES documentation example](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/ses-examples-sending-email.html)

It's a Nuts & Bolts application component for AWS Serverless Application Repository.

## Deployment Parameters

This component has three CloudFormation deployment parameters:

- `FromEmail`, a required parameter, representing the email sender. Must be a SES verified email.
- `TemplateName`, a required parameter, representing the name of an existing and valid Email Template you want to use.
- `CorsOrigin`, an optional parameter, where you can restrict access to only specified domains.

## Latest Release - 1.0.0

Initial release.

## Roadmap - Upcoming changes

Here are the upcoming changes that I'll add to this serverless component:

- ESLint
- Tests