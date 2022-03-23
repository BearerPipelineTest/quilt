import cx from 'classnames'
import * as React from 'react'
import { Link } from 'react-router-dom'
import * as M from '@material-ui/core'
import { fade } from '@material-ui/core/styles'

import * as NamedRoutes from 'utils/NamedRoutes'

import Collaborators from './Collaborators'

function Bucket({ bucket, onTagClick, tagIsMatching }) {
  const b = bucket
  const classes = useStyles()
  const { urls } = NamedRoutes.use()

  return (
    <div className={classes.bucket}>
      <div className={classes.shared}>
        {b.collaborators?.length && <Collaborators collaborators={b.collaborators} />}
      </div>

      <Link className={classes.title} to={urls.bucketRoot(b.name)}>
        {b.title}
      </Link>
      <Link className={classes.name} to={urls.bucketRoot(b.name)}>
        s3://{b.name}
      </Link>
      {!!b.description && <p className={classes.desc}>{b.description}</p>}
      <M.Box flexGrow={1} />
      {!!b.tags && !!b.tags.length && (
        <div className={classes.tags}>
          {b.tags.map((t) => (
            <button
              key={t}
              className={cx(
                classes.tag,
                tagIsMatching(t) && classes.matching,
                !!onTagClick && classes.active,
              )}
              type="button"
              onClick={() => onTagClick(t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const useStyles = M.makeStyles((t) => ({
  root: {
    display: 'grid',
    gridColumnGap: t.spacing(4),
    gridRowGap: t.spacing(4),
    gridTemplateColumns: '1fr 1fr 1fr',
    gridAutoRows: 'auto',
    [t.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr 1fr',
    },
    [t.breakpoints.down('xs')]: {
      gridTemplateColumns: 'auto',
    },
  },
  add: {
    alignItems: 'center',
    border: '2px dashed #2f306e',
    borderRadius: t.spacing(2),
    color: t.palette.tertiary.main,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: 'calc(50% - 2rem - 2px)',
    paddingTop: 'calc(50% - 2rem - 2px)',
    '&:hover': {
      background: fade(t.palette.tertiary.main, 0.04),
    },
    '& > span': {
      fontSize: '4rem',
    },
  },
  bucket: {
    background: 'linear-gradient(to top, #1f2151, #2f306e)',
    borderRadius: t.spacing(2),
    boxShadow: [[0, 16, 40, 'rgba(0, 0, 0, 0.2)']],
    display: 'flex',
    flexDirection: 'column',
    padding: t.spacing(4),
    position: 'relative',
  },
  title: {
    ...t.typography.h6,
    color: t.palette.tertiary.main,
  },
  name: {
    ...t.typography.body1,
    color: t.palette.text.hint,
    lineHeight: t.typography.pxToRem(24),
  },
  desc: {
    ...t.typography.body2,
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3,
    color: t.palette.text.secondary,
    display: '-webkit-box',
    lineHeight: t.typography.pxToRem(24),
    marginBottom: t.spacing(4),
    marginTop: t.spacing(3),
    maxHeight: t.typography.pxToRem(24 * 3),
    overflow: 'hidden',
    overflowWrap: 'break-word',
    textOverflow: 'ellipsis',
  },
  tags: {
    marginRight: t.spacing(-1),
  },
  active: {},
  matching: {},
  shared: {
    color: t.palette.text.hint,
    cursor: 'pointer',
    position: 'absolute',
    right: t.spacing(4),
    top: t.spacing(4),
  },
  tag: {
    ...t.typography.body2,
    background: fade(t.palette.secondary.main, 0.3),
    border: 'none',
    borderRadius: 2,
    color: t.palette.text.primary,
    display: 'inline-block',
    lineHeight: t.typography.pxToRem(28),
    marginRight: t.spacing(1),
    marginTop: t.spacing(1),
    outline: 'none',
    paddingBottom: 0,
    paddingLeft: t.spacing(1),
    paddingRight: t.spacing(1),
    paddingTop: 0,
    '&$active': {
      cursor: 'pointer',
    },
    '&$matching': {
      background: t.palette.secondary.main,
    },
  },
}))

export default React.forwardRef(function BucketGrid(
  { buckets, onTagClick, tagIsMatching = () => false, showAddLink = false },
  ref,
) {
  const classes = useStyles()
  const { urls } = NamedRoutes.use()
  return (
    <div className={classes.root} ref={ref}>
      {buckets.map((b) => (
        <Bucket
          bucket={b}
          key={b.name}
          onTagClick={onTagClick}
          tagIsMatching={tagIsMatching}
        />
      ))}
      {showAddLink && (
        <Link className={classes.add} to={urls.adminBuckets()}>
          <M.Icon>add</M.Icon>
        </Link>
      )}
    </div>
  )
})
