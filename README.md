# email-alert-middleware
Used Node and Express to set up emailing errors from a server

## Server meets the following requirements:

1. In the event of a FooError or BarError, the app should send an email alert to a recipient you specify in a config file (.env).
2. BizzErrors (roughly one-third of the time) should not trigger email alerts.

3. Each alert email should have a subject that looks like this: ALERT: a BarError occurred.
4. The alert email should have a from name and from email address. The from name should be something like "SERVICE ALERTS".
5. The body should summarize what happened and include the error message (err.message) and the stack trace (err.stack).
