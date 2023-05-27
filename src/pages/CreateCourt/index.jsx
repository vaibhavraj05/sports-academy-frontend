/* eslint-disable no-shadow */
import axios from '#/api/axios';
import { UploadOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, Modal, Space, Upload, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import shortid from 'shortid';

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

function createCourtApi(value) {
  return axios.post('court', value);
}

function updateCourtApi({ id, data }) {
  return axios.put(`court/${id}`, data);
}

function getImage(url, name) {
  return [{ uid: shortid.generate(), name, url }];
}

export default function CourtForm({
  open,
  onCancel: handleCancel,
  defaultValues,
  action = 'create'
}) {
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

  const { mutate: updateCourt } = useMutation(updateCourtApi, {
    onSuccess: () => {
      messageApi.open({ type: 'success', content: 'Entry updated successfully' });
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

    if (action === 'create') {
      createCourt(formData);
    } else {
      updateCourt({ id: defaultValues.id, data: formData });
    }
  }

  useEffect(() => {
    const { description, image_url: imageUrl, name } = defaultValues;
    if (!Object.keys(defaultValues).length) form.resetFields();
    else {
      form.setFieldsValue({
        ...defaultValues,
        description: JSON.stringify(description),
        image: getImage(imageUrl, name)
      });
    }
  }, [defaultValues]);

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title={`${action === 'create' ? 'Create a new court' : 'Update court'}`}
        okText={action === 'create' ? 'Create' : 'Update'}
        cancelText='Cancel'
        onCancel={handleCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              handleFinish(values);
              if (action === 'create') form.resetFields();
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form form={form} layout='vertical'>
          <Form.Item name='name' label='Name'>
            <Input name='name' />
          </Form.Item>
          <Space.Compact block>
            <Form.Item name='capacity' label='Capacity'>
              <InputNumber min={1} max={20} />
            </Form.Item>
            <Form.Item name='count' label='Number of courts'>
              <InputNumber min={1} />
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
            <Upload
              name='logo'
              beforeUpload={() => false}
              defaultFileList={[]}
              listType='picture'
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

CourtForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  defaultValues: PropTypes.object.isRequired,
  action: PropTypes.string
};
