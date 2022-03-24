import cx from 'classnames'
import * as R from 'ramda'
import * as React from 'react'
import { TransitionGroup } from 'react-transition-group'
import * as M from '@material-ui/core'

import JsonDisplay from 'components/JsonDisplay'
import * as perspective from 'utils/perspective'
import type { S3HandleBase } from 'utils/s3paths'

import { ParquetMetadata } from '../../loaders/Tabular'
import type { PerspectiveOptions } from '../../loaders/summarize'
import { CONTEXT } from '../../types'

const useParquetMetaStyles = M.makeStyles((t) => ({
  table: {
    margin: t.spacing(1, 0, 1, 3),
  },
  mono: {
    fontFamily: (t.typography as $TSFixMe).monospace.fontFamily,
  },
  metaName: {
    paddingRight: t.spacing(1),
    textAlign: 'left',
    verticalAlign: 'top',
  },
  metaValue: {
    paddingLeft: t.spacing(1),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  headerIcon: {
    fontSize: '1.1rem',
    transform: 'rotate(-90deg)',
    marginRight: t.spacing(0.5),
    transition: 'transform 0.3s ease',
  },
  headerIconExpanded: {
    transform: 'rotate(0deg)',
  },
}))

interface ParquetMetaProps extends ParquetMetadata {
  className: string
}

function ParquetMeta({
  className,
  createdBy,
  formatVersion,
  numRowGroups,
  schema, // { names }
  serializedSize,
  shape, // { rows, columns }
  ...props
}: ParquetMetaProps) {
  const classes = useParquetMetaStyles()
  const [show, setShow] = React.useState(false)
  const toggleShow = React.useCallback(() => setShow(!show), [show, setShow])
  const renderMeta = (
    name: string,
    value: ParquetMetadata[keyof ParquetMetadata],
    render: (v: $TSFixMe) => JSX.Element = R.identity,
  ) =>
    !!value && (
      <tr>
        <th className={classes.metaName}>{name}</th>
        <td className={classes.metaValue}>{render(value)}</td>
      </tr>
    )

  return (
    <div className={className} {...props}>
      <M.Typography className={classes.header} onClick={toggleShow}>
        <M.Icon
          className={cx(classes.headerIcon, { [classes.headerIconExpanded]: show })}
        >
          expand_more
        </M.Icon>
        Parquet metadata
      </M.Typography>
      <TransitionGroup>
        {show && (
          <M.Collapse in={show}>
            <table className={classes.table}>
              <tbody>
                {renderMeta('Created by:', createdBy, (c: string) => (
                  <span className={classes.mono}>{c}</span>
                ))}
                {renderMeta('Format version:', formatVersion, (v: string) => (
                  <span className={classes.mono}>{v}</span>
                ))}
                {renderMeta('# row groups:', numRowGroups)}
                {renderMeta('Serialized size:', serializedSize)}
                {renderMeta('Shape:', shape, ({ rows, columns }) => (
                  <span>
                    {rows} rows &times; {columns} columns
                  </span>
                ))}
                {renderMeta('Schema:', schema, (s: { names: string[] }) => (
                  /* @ts-expect-error */
                  <JsonDisplay value={s} />
                ))}
              </tbody>
            </table>
          </M.Collapse>
        )}
      </TransitionGroup>
    </div>
  )
}

const useTruncatedWarningStyles = M.makeStyles((t) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
  },
  message: {
    color: t.palette.text.secondary,
    marginRight: t.spacing(2),
  },
  icon: {
    display: 'inline-block',
    fontSize: '1.25rem',
    marginRight: t.spacing(0.5),
    verticalAlign: '-5px',
  },
}))

interface TruncatedWarningProps {
  className: string
  onLoadMore: () => void
  table: perspective.TableData | null
}

function TruncatedWarning({ className, onLoadMore, table }: TruncatedWarningProps) {
  const classes = useTruncatedWarningStyles()
  return (
    <div className={cx(classes.root, className)}>
      <span className={classes.message}>
        <M.Icon fontSize="small" color="inherit" className={classes.icon}>
          info_outlined
        </M.Icon>
        {table?.size ? `Showing only ${table?.size} rows` : `Partial preview`}
      </span>

      {!!onLoadMore && (
        <M.Button startIcon={<M.Icon>refresh</M.Icon>} size="small" onClick={onLoadMore}>
          Load more
        </M.Button>
      )}
    </div>
  )
}

const useStyles = M.makeStyles((t) => ({
  root: {
    width: '100%',
  },
  meta: {
    marginBottom: t.spacing(1),
  },
  viewer: {
    height: ({ context }: { context: 'file' | 'listing' }) =>
      context === CONTEXT.LISTING ? t.spacing(30) : t.spacing(50),
    overflow: 'auto',
    resize: 'vertical',
    zIndex: 1,
  },
  warning: {
    marginBottom: t.spacing(1),
  },
}))

export interface PerspectiveProps
  extends React.HTMLAttributes<HTMLDivElement>,
    PerspectiveOptions {
  context: 'file' | 'listing'
  data: string | ArrayBuffer
  meta: ParquetMetadata
  handle: S3HandleBase
  onLoadMore: () => void
  truncated: boolean
}

export default function Perspective({
  children,
  className,
  context,
  data,
  meta,
  handle,
  onLoadMore,
  truncated,
  settings,
  ...props
}: PerspectiveProps) {
  const classes = useStyles({ context })

  const [root, setRoot] = React.useState<HTMLDivElement | null>(null)

  const attrs = React.useMemo(() => ({ className: classes.viewer }), [classes])
  const tableData = perspective.use(root, data, attrs, settings)

  return (
    <div className={cx(className, classes.root)} ref={setRoot} {...props}>
      {truncated && (
        <TruncatedWarning
          className={classes.warning}
          table={tableData}
          onLoadMore={onLoadMore}
        />
      )}
      {!!meta && <ParquetMeta className={classes.meta} {...meta} />}
      {children}
    </div>
  )
}
