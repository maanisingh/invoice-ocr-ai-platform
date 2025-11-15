import { useState } from 'react'
import { Card, Table, Button, Space, Input, Select, DatePicker, Tag, Modal, Descriptions, message, Dropdown, Form } from 'antd'
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  CameraOutlined,
  MoreOutlined,
  FileExcelOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import StatusBadge from '@/components/common/StatusBadge'
import ConfidenceBadge from '@/components/common/ConfidenceBadge'
import { useInvoiceStore } from '@/store/invoiceStore'
import { useClientStore } from '@/store/clientStore'
import { useCategoryStore } from '@/store/categoryStore'
import { Invoice } from '@/types'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker
const { Option } = Select

export default function InvoicesPage() {
  const navigate = useNavigate()
  const { getInvoices, approveInvoice, rejectInvoice, deleteInvoice, bulkUpdateStatus, bulkDelete, updateInvoice } = useInvoiceStore()
  const { getClients } = useClientStore()
  const { getCategories } = useCategoryStore()

  const invoices = getInvoices()
  const clients = getClients()
  const categories = getCategories()

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [editForm] = Form.useForm()
  const [filters, setFilters] = useState({
    search: '',
    status: undefined,
    clientId: undefined,
    categoryId: undefined,
  })

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsModalVisible(true)
  }

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    editForm.setFieldsValue(invoice)
    setIsEditModalVisible(true)
  }

  const handleSaveEdit = async () => {
    try {
      const values = await editForm.validateFields()
      if (selectedInvoice) {
        updateInvoice(selectedInvoice.id, values)
        message.success('Invoice updated successfully')
        setIsEditModalVisible(false)
        setSelectedInvoice(null)
      }
    } catch (error) {
      message.error('Please check all required fields')
    }
  }

  const handleApprove = (id: string) => {
    approveInvoice(id)
    message.success('Invoice approved successfully')
  }

  const handleReject = (id: string) => {
    rejectInvoice(id)
    message.success('Invoice rejected')
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Invoice',
      content: 'Are you sure you want to delete this invoice?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        deleteInvoice(id)
        message.success('Invoice deleted successfully')
      },
    })
  }

  const handleExport = () => {
    message.success('Exporting invoices to CSV...')
  }

  const handleBulkAction = (action: string) => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select invoices first')
      return
    }

    const ids = selectedRowKeys as string[]

    if (action === 'Approved') {
      bulkUpdateStatus(ids, 'approved')
    } else if (action === 'Rejected') {
      bulkUpdateStatus(ids, 'rejected')
    } else if (action === 'Deleted') {
      bulkDelete(ids)
    }

    message.success(`${action} ${selectedRowKeys.length} invoices`)
    setSelectedRowKeys([])
  }

  const filteredInvoices = invoices.filter((invoice) => {
    if (filters.search && !invoice.invoiceNumber.toLowerCase().includes(filters.search.toLowerCase()) &&
        !invoice.vendorName.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    if (filters.status && invoice.status !== filters.status) {
      return false
    }
    if (filters.clientId && invoice.clientId !== filters.clientId) {
      return false
    }
    if (filters.categoryId && invoice.categoryId !== filters.categoryId) {
      return false
    }
    return true
  })

  const columns = [
    {
      title: 'Invoice #',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (text: string) => <span className="font-medium">{text}</span>,
      sorter: (a: Invoice, b: Invoice) => a.invoiceNumber.localeCompare(b.invoiceNumber),
    },
    {
      title: 'Vendor',
      dataIndex: 'vendorName',
      key: 'vendorName',
      sorter: (a: Invoice, b: Invoice) => a.vendorName.localeCompare(b.vendorName),
    },
    {
      title: 'Client',
      dataIndex: 'clientName',
      key: 'clientName',
      render: (text: string) => text || <Tag>Unassigned</Tag>,
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (text: string) => text ? <Tag color="blue">{text}</Tag> : <Tag>Uncategorized</Tag>,
    },
    {
      title: 'Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a: Invoice, b: Invoice) => dayjs(a.invoiceDate).unix() - dayjs(b.invoiceDate).unix(),
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number, record: Invoice) => (
        <span className="font-medium text-green-600">
          {record.currency} ${amount.toLocaleString()}
        </span>
      ),
      sorter: (a: Invoice, b: Invoice) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: any) => <StatusBadge status={status} />,
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
        { text: 'Processing', value: 'processing' },
      ],
      onFilter: (value: any, record: Invoice) => record.status === value,
    },
    {
      title: 'Confidence',
      dataIndex: 'ocrConfidence',
      key: 'ocrConfidence',
      render: (confidence: number) => <ConfidenceBadge confidence={confidence} />,
      sorter: (a: Invoice, b: Invoice) => a.ocrConfidence - b.ocrConfidence,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Invoice) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'view',
                icon: <EyeOutlined />,
                label: 'View Details',
                onClick: () => handleView(record),
              },
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: 'Edit',
                onClick: () => handleEdit(record),
              },
              {
                type: 'divider',
              },
              {
                key: 'approve',
                icon: <CheckOutlined />,
                label: 'Approve',
                onClick: () => handleApprove(record.id),
                disabled: record.status === 'approved',
              },
              {
                key: 'reject',
                icon: <CloseOutlined />,
                label: 'Reject',
                onClick: () => handleReject(record.id),
                disabled: record.status === 'rejected',
              },
              {
                type: 'divider',
              },
              {
                key: 'delete',
                icon: <DeleteOutlined />,
                label: 'Delete',
                danger: true,
                onClick: () => handleDelete(record.id),
              },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Invoices</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage all invoices</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button icon={<FileExcelOutlined />} onClick={handleExport} className="w-full sm:w-auto">
            Export
          </Button>
          <Button type="primary" icon={<CameraOutlined />} onClick={() => navigate('/admin/invoices/camera')} className="w-full sm:w-auto">
            Upload Invoice
          </Button>
        </div>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <Input
              placeholder="Search by invoice # or vendor..."
              prefix={<SearchOutlined />}
              className="w-full"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              allowClear
            />
            <Select
              placeholder="Filter by Status"
              className="w-full"
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              allowClear
            >
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
              <Option value="processing">Processing</Option>
            </Select>
            <Select
              placeholder="Filter by Client"
              className="w-full"
              value={filters.clientId}
              onChange={(value) => setFilters({ ...filters, clientId: value })}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {clients.map((client) => (
                <Option key={client.id} value={client.id}>
                  {client.name}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Filter by Category"
              className="w-full"
              value={filters.categoryId}
              onChange={(value) => setFilters({ ...filters, categoryId: value })}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
            <RangePicker className="w-full" />
          </div>

          {selectedRowKeys.length > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-blue-50 rounded">
              <span className="font-medium">{selectedRowKeys.length} selected</span>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={() => handleBulkAction('Approved')}
                  className="w-full sm:w-auto"
                >
                  Approve
                </Button>
                <Button
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => handleBulkAction('Rejected')}
                  className="w-full sm:w-auto"
                >
                  Reject
                </Button>
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleBulkAction('Deleted')}
                  className="w-full sm:w-auto"
                >
                  Delete
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredInvoices}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} invoices`,
              }}
              scroll={{ x: 800 }}
            />
          </div>
        </div>
      </Card>

      <Modal
        title="Invoice Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        className="w-full max-w-4xl"
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)} className="w-full sm:w-auto">
            Close
          </Button>,
          selectedInvoice?.status === 'pending' && (
            <Button
              key="reject"
              danger
              icon={<CloseOutlined />}
              onClick={() => {
                handleReject(selectedInvoice.id)
                setIsModalVisible(false)
              }}
              className="w-full sm:w-auto"
            >
              Reject
            </Button>
          ),
          selectedInvoice?.status === 'pending' && (
            <Button
              key="approve"
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => {
                handleApprove(selectedInvoice.id)
                setIsModalVisible(false)
              }}
              className="w-full sm:w-auto"
            >
              Approve
            </Button>
          ),
        ]}
      >
        {selectedInvoice && (
          <div className="space-y-4">
            <Descriptions bordered column={{ xs: 1, sm: 2 }}>
              <Descriptions.Item label="Invoice #" span={1}>
                {selectedInvoice.invoiceNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={1}>
                <StatusBadge status={selectedInvoice.status} />
              </Descriptions.Item>
              <Descriptions.Item label="Vendor" span={2}>
                {selectedInvoice.vendorName}
              </Descriptions.Item>
              <Descriptions.Item label="Client" span={2}>
                {selectedInvoice.clientName || 'Unassigned'}
              </Descriptions.Item>
              <Descriptions.Item label="Invoice Date" span={1}>
                {dayjs(selectedInvoice.invoiceDate).format('MMM DD, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Due Date" span={1}>
                {selectedInvoice.dueDate ? dayjs(selectedInvoice.dueDate).format('MMM DD, YYYY') : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Subtotal" span={1}>
                ${selectedInvoice.subtotal?.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Tax" span={1}>
                ${selectedInvoice.taxAmount?.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount" span={2}>
                <span className="text-lg sm:text-xl font-bold text-green-600">
                  {selectedInvoice.currency} ${selectedInvoice.totalAmount.toLocaleString()}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="OCR Confidence" span={2}>
                <ConfidenceBadge confidence={selectedInvoice.ocrConfidence} />
              </Descriptions.Item>
              <Descriptions.Item label="Category" span={2}>
                {selectedInvoice.categoryName ? (
                  <Tag color="blue">{selectedInvoice.categoryName}</Tag>
                ) : (
                  <Tag>Uncategorized</Tag>
                )}
              </Descriptions.Item>
              {selectedInvoice.notes && (
                <Descriptions.Item label="Notes" span={2}>
                  {selectedInvoice.notes}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Card title="Line Items" size="small">
              <div className="overflow-x-auto">
                <Table
                  dataSource={selectedInvoice.items}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  scroll={{ x: 600 }}
                  columns={[
                    {
                      title: 'Description',
                      dataIndex: 'description',
                      key: 'description',
                    },
                    {
                      title: 'Quantity',
                      dataIndex: 'quantity',
                      key: 'quantity',
                    },
                    {
                      title: 'Unit Price',
                      dataIndex: 'unitPrice',
                      key: 'unitPrice',
                      render: (price: number) => `$${price.toLocaleString()}`,
                    },
                    {
                      title: 'Amount',
                      dataIndex: 'amount',
                      key: 'amount',
                      render: (amount: number) => (
                        <span className="font-medium">${amount.toLocaleString()}</span>
                      ),
                    },
                  ]}
                />
              </div>
            </Card>
          </div>
        )}
      </Modal>

      <Modal
        title="Edit Invoice"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false)
          setSelectedInvoice(null)
        }}
        onOk={handleSaveEdit}
        className="w-full max-w-lg"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="invoiceNumber" label="Invoice Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="vendorName" label="Vendor Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="totalAmount" label="Total Amount" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
              <Option value="processing">Processing</Option>
            </Select>
          </Form.Item>
          <Form.Item name="clientId" label="Client">
            <Select allowClear showSearch optionFilterProp="children">
              {clients.map((client) => (
                <Option key={client.id} value={client.id}>
                  {client.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="categoryId" label="Category">
            <Select allowClear showSearch optionFilterProp="children">
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
