# Form / Message Bar
# Use message bars to indicate relevant status information.
# ---
from telesync import site, ui

page = site['/demo']

page['example'] = ui.form_card(
    box='1 1 4 -1',
    items=[
        ui.message_bar(type='blocked', text='You are not authorized to perform this action.'),
        ui.message_bar(type='error', text='This is an error message.'),
        ui.message_bar(type='warning', text='This is a warning message.'),
        ui.message_bar(type='info', text='This is an information message.'),
        ui.message_bar(type='success', text='This is an success message.'),
        ui.message_bar(type='danger', text='This is a danger message.'),
    ]
)
page.save()
