import { useState } from 'react'
import { Upload, message } from 'antd'
import {
  FilePdfOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  InboxOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { INVOICE_FORMATS } from '@/types'
import { motion } from 'framer-motion'
import { cn, modernCard, gradients, hoverLift, hoverGlow } from '@/lib/utils'

const { Dragger } = Upload

export default function UploadPage() {
  const [fileList, setFileList] = useState<any[]>([])

  const uploadProps = {
    name: 'file',
    multiple: true,
    accept: '.pdf,.jpg,.jpeg,.png,.xml,.xlsx,.xls,.doc,.docx',
    fileList,
    beforeUpload: (file: any) => {
      const isValidSize = file.size / 1024 / 1024 < 10 // 10MB
      if (!isValidSize) {
        message.error(`${file.name} is larger than 10MB!`)
        return false
      }
      return true
    },
    onChange(info: any) {
      setFileList(info.fileList)
      const { status } = info.file
      if (status === 'done') {
        message.success(`${info.file.name} uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} upload failed.`)
      }
    },
    onRemove: (file: any) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
  }

  const getFormatIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      FilePdfOutlined: FilePdfOutlined,
      FileImageOutlined: FileImageOutlined,
      FileTextOutlined: FileTextOutlined,
      FileExcelOutlined: FileExcelOutlined,
      FileWordOutlined: FileWordOutlined,
    }
    const IconComponent = icons[iconName] || FileTextOutlined
    return <IconComponent className="text-4xl" />
  }

  return (
    <div className="h-full pb-20 lg:pb-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Mobile View */}
      <div className="lg:hidden min-h-screen">
        {/* Header */}
        <div className={cn("px-4 pt-8 pb-10", gradients.ocean)}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <h2 className="text-3xl font-black mb-2">Upload Documents</h2>
            <p className="text-white/80 text-sm font-medium">
              Upload invoices in multiple formats
            </p>
          </motion.div>
        </div>

        {/* Upload Area */}
        <div className="px-4 -mt-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(modernCard, "bg-white p-6", hoverGlow)}
          >
            <Dragger {...uploadProps}>
              <div className="py-8">
                <InboxOutlined className="text-6xl text-blue-500 mb-4" />
                <p className="text-lg font-bold text-gray-900 mb-2">
                  Tap to upload files
                </p>
                <p className="text-sm text-gray-500">
                  PDF, Images, Excel, Word, XML
                </p>
              </div>
            </Dragger>
          </motion.div>
        </div>

        {/* Supported Formats */}
        <div className="px-4 pb-6">
          <h3 className="text-lg font-black text-gray-900 mb-4">Supported Formats</h3>
          <div className="grid grid-cols-2 gap-3">
            {INVOICE_FORMATS.map((format, index) => (
              <motion.div
                key={format.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className={cn(modernCard, "bg-white p-4 text-center", hoverLift)}
              >
                <div className="text-blue-600 mb-3">{getFormatIcon(format.icon)}</div>
                <div className="text-sm font-bold text-gray-900 mb-1">{format.name}</div>
                <div className="text-xs text-gray-500 mb-2">
                  Max {(format.maxSize / 1024 / 1024).toFixed(0)}MB
                </div>
                {format.ocrSupported && (
                  <div className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                    <CheckCircleOutlined />
                    OCR
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block space-y-6 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-black text-gray-900 mb-2">Upload Documents</h1>
          <p className="text-gray-500 text-lg">Upload and process your invoices</p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(modernCard, "bg-white p-8", hoverGlow)}
        >
          <Dragger {...uploadProps} style={{ padding: '60px 40px' }}>
            <InboxOutlined className="text-8xl text-blue-500 mb-6" />
            <p className="text-2xl font-black text-gray-900 mb-3">
              Click or drag files to upload
            </p>
            <p className="text-base text-gray-500">
              Support for PDF, Images (JPG, PNG), Excel, Word, and XML formats
            </p>
          </Dragger>
        </motion.div>

        {/* Supported Formats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(modernCard, "bg-white p-8", hoverGlow)}
        >
          <h2 className="text-2xl font-black text-gray-900 mb-6">Supported File Formats</h2>
          <div className="grid grid-cols-5 gap-6">
            {INVOICE_FORMATS.map((format, index) => (
              <motion.div
                key={format.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className={cn(modernCard, "bg-gray-50 p-6 text-center", hoverLift, hoverGlow)}
              >
                <div className="text-blue-600 mb-4">{getFormatIcon(format.icon)}</div>
                <div className="font-black text-gray-900 mb-2">{format.name}</div>
                <div className="text-sm text-gray-600 mb-3">{format.description}</div>
                <div className="text-xs text-gray-500 mb-3">
                  Max {(format.maxSize / 1024 / 1024).toFixed(0)}MB
                </div>
                {format.ocrSupported && (
                  <div className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-bold">
                    <CheckCircleOutlined />
                    OCR Supported
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
