import { useCallback, useState } from "react"
import { FileWithPath, useDropzone } from "react-dropzone"

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
};

const ProfileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([])
  const [fileUrl, setFileUrl] = useState(mediaUrl)


  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFile(acceptedFiles)
    fieldChange(acceptedFiles)
    setFileUrl(URL.createObjectURL(acceptedFiles[0]))
  }, [file])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpeg", ".jpeg", ".svg", ".webp"] }
  })


  return (
    <div {...getRootProps()} className="flex flex-1 w-fit cursor-pointer">
      <input {...getInputProps()} className="cursor-pointer" />

      <div className="flex flex-start gap-4">
        <img
          src={fileUrl || "/assets/icons/profile-placeholder.svg"}
          alt="profile-photo"
          className="w-24 h-24 rounded-full object-cover object-top"
        />
        <p className="text-primary-500 small-regular md:bbase-semibold">Change Profile Photo</p>
      </div>





    </div>
  )
}

export default ProfileUploader