import { useIntl } from "umi";
import { Select, Form, Empty, Cascader, FormInstance, Table, Radio } from "antd";
import { useModel } from "@@/plugin-model/useModel";
import { InstanceType } from "@/services/systemSetting";
import { LocalTables, TableColumn } from "@/services/dataLogs";
import { useState } from "react";

const { Option } = Select;

type LocalTableProps = {
  formRef: FormInstance | null;
};
const LocalTable = ({ formRef }: LocalTableProps) => {
  const i18n = useIntl();
  const { getLocalTables, getTableColumns } = useModel("dataLogs");
  const { instanceList } = useModel("instances");
  const [options, setOptions] = useState<any[]>([]);
  const [allColumns, setAllColumns] = useState<TableColumn[]>([]);
  const [conformToStandard, setConformToStandard] = useState<TableColumn[]>([]);
  const [timeFieldType, setTimeFieldType] = useState<number>(0);

  const formatOptions = (list: LocalTables[]) => {
    setOptions(
      list?.map((item) => ({
        value: item.name,
        label: item.name,
        children:
          item?.tables?.map((table) => ({
            value: table.name,
            label: table.name,
          })) || [],
      })) || []
    );
  };

  return (
    <>
      <Form.Item
        label={i18n.formatMessage({ id: "datasource.draw.table.instance" })}
        name={"instance"}
        rules={[
          {
            required: true,
            message: i18n.formatMessage({
              id: "datasource.draw.selected",
            }),
          },
        ]}
      >
        <Select
          placeholder={`${i18n.formatMessage({
            id: "datasource.draw.selected",
          })}`}
          onChange={(val) => {
            if (!val) return;
            formRef?.resetFields(["localTables"]);
            getLocalTables.run(val as number).then((res) => {
              if (res?.code !== 0) return;
              formatOptions(res.data);
            });
          }}
        >
          {instanceList.map((item: InstanceType, index: number) => (
            <Option key={index} value={item.id as number}>
              {item.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, nextValues) =>
          prevValues.instance !== nextValues.instance
        }
      >
        {({ getFieldValue }) => {
          const instanceFlag = !!getFieldValue("instance");
          return (
            <>
              <Form.Item
                label={`${i18n.formatMessage({
                  id: "instance.datasource",
                })}/${i18n.formatMessage({
                  id: "alarm.rules.inspectionFrequency.selectOption.logLibrary",
                })}`}
                name={"localTables"}
                rules={[
                  {
                    required: true,
                    message: i18n.formatMessage({
                      id: "alarm.rules.selected.placeholder.database",
                    }),
                  },
                ]}
              >
                <Cascader
                  showSearch
                  options={options}
                  expandTrigger="hover"
                  placeholder={`${i18n.formatMessage({
                    id: "alarm.rules.selected.placeholder.database",
                  })}`}
                  onChange={(values: any[]) => {
                    if (!values || values.length !== 2) return;
                    formRef?.resetFields(["timeField"]);
                    getTableColumns
                      .run(getFieldValue(["instance"]), {
                        databaseName: values[0],
                        tableName: values[1],
                      })
                      .then((res) => {
                        if (res?.code !== 0) return;
                        setAllColumns(res.data.all);
                        setConformToStandard(res.data.conformToStandard);
                      });
                  }}
                  disabled={!instanceFlag}
                />
              </Form.Item>
            </>
          );
        }}
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, nextValues) =>
          prevValues.tableName !== nextValues.tableName
        }
      >
        {({ getFieldValue }) => {
          const table =
            !!getFieldValue("localTables") &&
            getFieldValue("localTables").length === 2;
          if (!table)
            return (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={i18n.formatMessage({
                  id: "alarm.rules.selected.placeholder.logLibrary",
                })}
              />
            );
          return (
            <>
              <Form.Item
                label={i18n.formatMessage({
                  id: "datasource.logLibrary.from.newLogLibrary.timeResolutionField",
                })}
                name={"timeField"}
                rules={[
                  {
                    required: true,
                    message: i18n.formatMessage({
                      id: "datasource.logLibrary.from.newLogLibrary.timeResolutionField.placeholder",
                    }),
                  },
                ]}
              >
                <Select
                  placeholder={`${i18n.formatMessage({
                    id: "datasource.logLibrary.from.newLogLibrary.timeResolutionField.placeholder",
                  })}`}
                  onChange={(value, option)=>{
                      if (value) {
                          const item = conformToStandard.filter((item) => item.name === value).at(0)
                          if (item) {
                              setTimeFieldType(item.type)
                          }
                      }
                  }}
                >
                  {conformToStandard.map((item) => (
                    <Option key={item.name} value={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
                {timeFieldType === 1 && (
                    <Form.Item name={"timeFieldType"} label={i18n.formatMessage({
                        id: "datasource.logLibrary.from.newLogLibrary.timeFieldType",
                    })} rules={[{
                            required: true,
                            message: i18n.formatMessage({
                                id: "datasource.logLibrary.from.newLogLibrary.timeResolutionFieldType.placeholder",
                            }),
                        }]}>
                        <Radio.Group>
                            <Radio value={1}>{i18n.formatMessage({
                                id: "datasource.logLibrary.from.newLogLibrary.timeType.seconds",
                            })}</Radio>
                            <Radio value={2}>{i18n.formatMessage({
                                id: "datasource.logLibrary.from.newLogLibrary.timeType.millisecond",
                            })}</Radio>
                        </Radio.Group>
                    </Form.Item>
                )}
              <Form.Item
                label={i18n.formatMessage({
                  id: "datasource.logLibrary.from.newLogLibrary.fieldsInTheTable",
                })}
              >
                <Table
                  size={"small"}
                  loading={getTableColumns.loading}
                  columns={[{ title: "Column", dataIndex: "name" }]}
                  dataSource={allColumns}
                  scroll={{ y: 200 }}
                  pagination={false}
                />
              </Form.Item>
            </>
          );
        }}
      </Form.Item>
    </>
  );
};
export default LocalTable;
