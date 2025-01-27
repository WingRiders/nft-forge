import Image from 'next/image'
import {useEffect, useState} from 'react'
import {Label} from './Typography/Label'

type FileImagePreviewProps = {
  file: File
}

export const FileImagePreview = ({file}: FileImagePreviewProps) => {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    const reader = new FileReader()
    reader.onload = (event) => {
      setSrc(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [file])

  return src ? (
    <Image src={src} alt={file.name} width={200} height={200} />
  ) : (
    <Label>Loading...</Label>
  )
}
