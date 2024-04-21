import YAML from 'js-yaml';
import { Upload, Typography } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { AppConfig } from './Types';

export const SetupApp = ({ onUploaded }: { onUploaded: (config: AppConfig) => void }) => {
  const handleFileChange = (info: any) => {
    const { status } = info.file;
    if (status === 'done') {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        console.log(`${info.file.name} file uploaded successfully.`);
        onUploaded(YAML.load(e.target.result) as AppConfig);
      };
      reader.readAsText(info.file.originFileObj);
    }
  };
  return (
    <Upload.Dragger
      name="file"
      multiple={false}
      customRequest={(i: any) => setTimeout(() => i.onSuccess("ok"), 0)}
      accept=".yml,.yaml"
      onChange={handleFileChange}
      style={{'height': '100%'}}>
      <Typography.Title level={3}>Welcome to ROS Gateway !</Typography.Title>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag YAML file to this area to upload</p>
    </Upload.Dragger>
  );
};
