import debounce from 'lodash.debounce'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { RiShareForwardLine } from 'react-icons/ri'
import Loading from '../../components/loading'
import ReadContent from '../../components/readContent'
import Toolbar from '../../components/toolBar'
import { useAuth } from '../../contexts/auth/authContext'
import { useKeepSaving } from '../../contexts/keepSaving'
import useAddRecents from '../../hooks/useAddRecents'
import {
  editContent,
  editTitle,
  getKeepData,
  shareKeep,
} from '../../lib/helper'
import s from '../../styles/keepPage.module.css'

export default function KeepPage() {
  // States
  const [data, setData] = useState({
    title: '',
    content: '',
    name: '',
  })

  const [isLoading, setIsLoading] = useState(true)
  const [shareLoading, setShareLoading] = useState(false)

  const [edit, setEdit] = useState(true)

  // Ref
  const isCancel = useRef(false)

  const { title, content, name } = data

  // Saving context
  const { changeKeepSaving } = useKeepSaving()
  const { user } = useAuth()

  // ROuter
  const router = useRouter()
  const {
    query: { keepId },
  } = router

  const isOwn = data?.uid === user?.uid

  // Change Content
  const changeContent = (e) => {
    changeKeepSaving(true)
    setData((prev) => ({
      ...prev,
      content: e.target.value,
    }))
    debounceContent(e.target.value)
  }

  // Change Title
  const changeTitle = (e) => {
    changeKeepSaving(true)
    setData((prev) => ({
      ...prev,
      title: e.target.value,
    }))
    debounceTitle(e.target.value)
  }

  // Debounce Content update
  const debounceContent = useCallback(
    debounce(async (content) => {
      console.count('Runn content')
      try {
        await editContent(keepId, content)
        changeKeepSaving(false)
      } catch (error) {
        console.log(error.message)
        toast.error(<b>{error.message}</b>)
      }
    }, 1800),
    [keepId]
  )

  // Debounce title update
  const debounceTitle = useCallback(
    debounce(async (title) => {
      console.count('Runn title')
      try {
        await editTitle(keepId, user?.uid, title)
        changeKeepSaving(false)
      } catch (error) {
        console.log(error.message)
        toast.error(<b>{error.message}</b>)
      }
    }, 1800),
    [keepId]
  )

  // Share keep
  const handleShare = async () => {
    setShareLoading(true)
    try {
      await shareKeep(keepId, title)
      setShareLoading(false)
    } catch (error) {
      console.log(error.message)
      toast.error(<b>{error.message}</b>)
      setShareLoading(false)
    }
  }

  // Side Effects

  // Getting initial Content
  useEffect(() => {
    const handleData = async () => {
      try {
        setIsLoading(true)
        const res = await getKeepData(keepId)
        if (res) {
          if (!isCancel.current) {
            setData(res)
            setIsLoading(false)
          }
        } else {
          router.push('/')
        }
      } catch (error) {
        console.log(error.message)
        toast.error(<b>{error.message}</b>)
        setIsLoading(false)
      }
    }
    keepId && handleData()
  }, [keepId])

  // Cancel Sideeffects
  useEffect(() => {
    isCancel.current = false
    return () => (isCancel.current = true)
  }, [])

  // Adding to Recents
  useAddRecents(title, keepId)

  if (isLoading) {
    return <Loading text="Getting Keep.." />
  }

  return (
    <>
      <Head>
        <title>{title || 'Keep'} | NoteKaro</title>
      </Head>
      <div className={`${s.keepPage} wrapper`}>
        {isOwn ? (
          <Toolbar
            keepId={keepId}
            edit={edit}
            setEdit={setEdit}
            uid={user?.uid}
          />
        ) : null}

        <div className={s.keepInfo}>
          <p>Kept by {name || 'User'}</p>
          {isOwn ? (
            <Toolbar
              keepId={keepId}
              edit={edit}
              setEdit={setEdit}
              uid={user?.uid}
            />
          ) : null}
          <button disabled={shareLoading} onClick={handleShare}>
            <RiShareForwardLine /> {shareLoading ? 'Sharing' : 'Share this'}
          </button>
        </div>
        {edit && isOwn ? (
          <>
            <input
              name="title"
              value={title}
              onChange={changeTitle}
              type="text"
              placeholder="Title of the Keep"
              maxLength={100}
            />

            <textarea
              wrap="hard"
              name="content"
              value={content}
              onChange={changeContent}
              placeholder="Type your content here"
            />
          </>
        ) : (
          <ReadContent title={title} content={content} />
        )}
      </div>
    </>
  )
}
