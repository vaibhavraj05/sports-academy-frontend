/* eslint-disable no-shadow */
import axios from '#/api/axios';
import { UploadOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, Modal, Space, Upload, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import PropTypes from 'prop-types';

const normFile = (e) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

function createCourtApi(value) {
  return axios.post('court', value);
}

export default function CreateCourt({ open, onCancel: handleCancel }) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { mutate: createCourt } = useMutation(createCourtApi, {
    onSuccess: () => {
      messageApi.open({ type: 'success', content: 'Entry added successfully' });
    },
    onError: (error) => {
      const { path, message } = error.response.data.error.details.errors[0];
      messageApi.open({ type: 'error', content: `${path[0]}: ${message.toLowerCase()}` });
    }
  });

  function handleFinish(value) {
    const { name, description, count, capacity, image } = value;
    const data = {
      name,
      description: JSON.parse(description),
      count,
      capacity
    };
    const formData = new FormData();
    if (image?.length) {
      if (image[0].originFileObj) {
        formData.append('file', image[0].originFileObj, image[0].name);
      } else {
        formData.append('file', null);
      }
    } else {
      formData.append('file', null);
    }
    formData.append('data', JSON.stringify(data));
    createCourt(formData);
  }

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title='Create a new collection'
        okText='Create'
        cancelText='Cancel'
        onCancel={handleCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              handleFinish(values);
              // form.resetFields();
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form form={form} layout='vertical'>
          <Form.Item name='name' label='Name'>
            <Input />
          </Form.Item>
          <Space.Compact block>
            <Form.Item name='capacity' label='Capacity'>
              <InputNumber min={1} max={20} defaultValue={4} />
            </Form.Item>
            <Form.Item name='court-count' label='Number of courts'>
              <InputNumber min={1} defaultValue={1} />
            </Form.Item>
          </Space.Compact>

          <Form.Item name='description' label='Description'>
            <TextArea rows={4} style={{ height: 120, resize: 'none' }} />
          </Form.Item>

          <Form.Item
            name='image'
            label='Image Upload'
            valuePropName='fileList'
            getValueFromEvent={normFile}
          >
            <Upload name='logo' beforeUpload={() => false} listType='picture' maxCount={1}>
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

CreateCourt.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired
};
