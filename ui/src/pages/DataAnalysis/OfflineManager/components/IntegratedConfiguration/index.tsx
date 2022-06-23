import FileTitle from "@/pages/DataAnalysis/OfflineManager/components/IntegratedConfiguration/FileTitle";
import IntegratedConfigs from "@/pages/DataAnalysis/OfflineManager/components/IntegratedConfiguration/IntegratedConfigs";
import CustomCollapse from "@/pages/DataAnalysis/OfflineManager/components/IntegratedConfiguration/CustomCollapse";
import { CustomCollapseEnums } from "@/pages/DataAnalysis/OfflineManager/components/IntegratedConfiguration/config";
import { Form } from "antd";

export interface IntegratedConfigurationProps {
  currentNode: any;
}
const IntegratedConfiguration = ({
  currentNode,
}: IntegratedConfigurationProps) => {
  const [form] = Form.useForm();
  return (
    <div style={{ flex: 1, minHeight: 0 }}>
      <FileTitle file={currentNode} />
      <div
        style={{
          height: "calc(100vh - 136px)",
          overflowY: "scroll",
          paddingBottom: "30px",
        }}
      >
        <CustomCollapse
          children={<IntegratedConfigs form={form} file={currentNode} />}
          type={CustomCollapseEnums.dataSource}
        />
        <CustomCollapse
          children={<>fieldMapping</>}
          type={CustomCollapseEnums.fieldMapping}
        />
        <CustomCollapse
          children={<>schedulingConfig</>}
          type={CustomCollapseEnums.schedulingConfig}
        />
      </div>
    </div>
  );
};
export default IntegratedConfiguration;