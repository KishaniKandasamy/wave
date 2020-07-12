# Plot / Line / Groups
# Make a multi-series line plot.
# ---
from synth import FakeMultiTimeSeries
from telesync import site, data, ui

page = site['/demo']

n = 50
f = FakeMultiTimeSeries()
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Line, groups',
    data=data('product date price', n * 5),
    plot=ui.plot([ui.mark(type='line', x_scale='time', x='=date', y='=price', color='=product', y_min=0)])
))

v.data = [(g, t, x) for x in [f.next() for _ in range(n)] for g, t, x, dx in x]

page.save()
