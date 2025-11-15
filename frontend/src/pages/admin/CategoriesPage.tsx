import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, FolderOutlined } from '@ant-design/icons'
import { useCategoryStore } from '@/store/categoryStore'
import { Category } from '@/types'

export default function CategoriesPage() {
  const { getCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore()
  const categories = getCategories()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [form] = Form.useForm()

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (editingCategory) {
        updateCategory(editingCategory.id, {
          ...values,
          keywords: values.keywords ? values.keywords.split(',').map((k: string) => k.trim()) : [],
        })
        message.success('Category updated successfully')
      } else {
        const newCategory: Category = {
          id: Date.now().toString(),
          ...values,
          keywords: values.keywords ? values.keywords.split(',').map((k: string) => k.trim()) : [],
          color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        }
        addCategory(newCategory)
        message.success('Category created successfully')
      }
      setIsModalVisible(false)
      setEditingCategory(null)
      form.resetFields()
    } catch (error) {
      message.error('Please check all required fields')
    }
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Category',
      content: 'Are you sure you want to delete this category?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        deleteCategory(id)
        message.success('Category deleted successfully')
      },
    })
  }

  const columns = [
    {
      title: 'Category',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Category) => (
        <Space>
          <FolderOutlined style={{ color: record.color }} />
          <span className="font-medium">{text}</span>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Account Code',
      dataIndex: 'accountCode',
      key: 'accountCode',
      render: (code: string) => <Tag>{code}</Tag>,
    },
    {
      title: 'Keywords',
      dataIndex: 'keywords',
      key: 'keywords',
      render: (keywords: string[]) => (
        <Space wrap>
          {keywords.slice(0, 3).map((keyword) => (
            <Tag key={keyword} color="blue">{keyword}</Tag>
          ))}
          {keywords.length > 3 && <Tag>+{keywords.length - 3} more</Tag>}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Category) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCategory(record)
              form.setFieldsValue({
                ...record,
                keywords: record.keywords?.join(', ') || '',
              })
              setIsModalVisible(true)
            }}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Section - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Categories</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Manage invoice categories</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCategory(null)
            form.resetFields()
            setIsModalVisible(true)
          }}
          className="w-full sm:w-auto"
          size="large"
        >
          <span className="hidden sm:inline">Add Category</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Table Card - Responsive */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={categories}
            rowKey="id"
            scroll={{ x: 800 }}
            size="middle"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} categories`,
              className: "px-4 py-2"
            }}
            className="enterprise-table"
          />
        </div>
      </Card>

      {/* Modal - Responsive */}
      <Modal
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingCategory(null)
          form.resetFields()
        }}
        onOk={handleSave}
        width={window.innerWidth < 640 ? '95%' : 520}
        className="responsive-modal"
        okText="Save"
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input
              placeholder="Enter category name"
              size="large"
            />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea
              rows={window.innerWidth < 640 ? 2 : 3}
              placeholder="Enter category description"
              size="large"
            />
          </Form.Item>

          <Form.Item name="accountCode" label="Account Code">
            <Input
              placeholder="e.g., 6100"
              size="large"
            />
          </Form.Item>

          <Form.Item name="keywords" label="Keywords">
            <Input
              placeholder="Comma-separated keywords (e.g., office, supplies, equipment)"
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
