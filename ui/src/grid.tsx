import React from 'react'
import { stylesheet } from 'typestyle'
import { B, Card, unpack, Rec, S, Data, xid, box, bond } from './qd'
import { cards, CardView, Format } from './layout'
import { getTheme } from './theme'

const
  theme = getTheme(),
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
    body: {
      flexGrow: 1,
      overflow: 'auto',
      $nest: {
        '>*': {
          borderBottom: '1px solid ' + theme.colors.text1,
          padding: '5px 0',
        },
      },
    },
    table: {
      width: '100%',
    }
  })

/** EXPERIMENTAL. DO NOT USE. */
interface State {
  /** EXPERIMENTAL. DO NOT USE. */
  title: S
  /** EXPERIMENTAL. DO NOT USE. */
  cells: Data
  /** EXPERIMENTAL. DO NOT USE. */
  data: Data
}

export const
  View = bond(({ state: s, changed }: Card<State>) => {
    const
      render = () => {
        let cells = unpack<any[]>(s.cells)

        if (!Array.isArray(cells)) cells = [{ title: 'Data' }]

        const
          ths = cells.map((cell, i) => (<th key={i}>{cell.title}</th>)),
          columns = cells.map(({ view, props, value }) => ({ view, props: unpack<Rec>(props), value })),
          trs = unpack<Rec[]>(s.data).map((data, i) => {
            const tds = columns.map(({ view, props, value }, j) => {
              if (value != null) {
                return <td><Format data={data} format={value} /></td>
              } else {
                const card: Card<any> = {
                  name: xid(),
                  state: { ...props, view, data },
                  changed: box<B>(),
                }
                return <td><CardView key={j} card={card} /></td>
              }
            })
            return (<tr key={i}>{tds}</tr>)
          })

        return (
          <div data-test='grid' className={css.card}>
            <div className={css.title}>{s.title || 'Untitled'}</div>
            <div className={css.body}>
              <table className={css.table}>
                <thead>
                  <tr>{ths}</tr>
                </thead>
                <tbody>
                  {trs}
                </tbody>
              </table>
            </div>
          </div>
        )
      }
    return { render, changed }
  })

cards.register('grid', View)

