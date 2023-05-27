import axios from '#/api/axios';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Col, Image, Popconfirm, Row, Space, Table, Typography } from 'antd';
import { useState } from 'react';
import shortid from 'shortid';
import CourtForm from '../CreateCourt';

const { Title, Text } = Typography;

function fetchCourts() {
  return axios.get('court');
}

function deleteCourtApi(courtId) {
  return axios.delete(`court/${courtId}`);
}

export default function AdminHome() {
  const [openModal, setOpenModal] = useState(false);
  const [defaultFormValues, setDefaultFormValues] = useState({});
  const [courtAction, setCourtAction] = useState('create');

  const {
    data: courtData,
    isLoading,
    refetch: refetchCourts
  } = useQuery({ queryKey: ['courts'], queryFn: fetchCourts });

  const { mutate: deleteCourt } = useMutation(deleteCourtApi, {
    onSuccess: refetchCourts
  });

  const handleEditClick = (value) => {
    setDefaultFormValues(value);
    setCourtAction('update');
    setOpenModal(true);
  };

  const handleCreateClick = () => {
    setDefaultFormValues({});
    setCourtAction('create');
    setOpenModal(true);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Image',
      dataIndex: 'image_url',
      key: 'image',
      render: (data) => <Image src={data} width={200} className='aspect-video object-cover' />
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (data) => (
        <div className='grid grid-cols-2'>
          {Object.entries(data).map(([key, value]) => (
            <p key={shortid.generate()}>
              <span className='font-semibold capitalize text-slate-900'>{key}: </span>
              <span className='font-medium text-slate-700'>{value}</span>
            </p>
          ))}
        </div>
      )
    },
    {
      title: 'Capacity',
      key: 'capacity',
      dataIndex: 'capacity'
    },
    {
      title: 'Count',
      key: 'count',
      dataIndex: 'count'
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'action',
      render: (_, value) => {
        const { id } = value;
        return (
          <Space>
            <Popconfirm
              title='Delete the entry'
              description='Are you sure to delete this entry?'
              onConfirm={() => {
                deleteCourt(id);
              }}
              okText='Yes'
              cancelText='No'
              placement='left'
            >
              <Button type='text' danger size='small'>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
            <Button type='text' size='small' onClick={() => handleEditClick(value)}>
              <EditOutlined />
            </Button>
          </Space>
        );
      }
    }
  ];

  return (
    <div className='h-full bg-white p-3'>
      <Title level={2} style={{ margin: 0 }}>
        Courts
      </Title>
      <Text type='secondary'>{courtData?.length} entries found</Text>
      <Row justify='end'>
        <Col>
          <Button type='primary' icon={<PlusOutlined />} onClick={handleCreateClick}>
            Create new entry
          </Button>
        </Col>
      </Row>
      <Table columns={columns} dataSource={courtData} loading={isLoading} />
      <CourtForm
        open={openModal}
        onCancel={() => setOpenModal(false)}
        defaultValues={defaultFormValues}
        action={courtAction}
      />
    </div>
  );
}
