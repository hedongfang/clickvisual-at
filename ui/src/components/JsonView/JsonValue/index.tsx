import jsonViewStyles from "@/components/JsonView/index.less";
import JsonData from "@/components/JsonView/JsonData";
import classNames from "classnames";
import JsonStringValue from "@/components/JsonView/JsonStringValue";
import { Key, useMemo, useState } from "react";
import { CaretDownOutlined, CaretRightOutlined } from "@ant-design/icons";
import ClickMenu from "@/pages/DataLogs/components/QueryResult/Content/RawLog/ClickMenu";

const indentStyle = {
  paddingLeft: "20px",
};

const JsonArr = (props: {
  jsonKey: any;
  restProps: any;
  hierarchy: number;
  val: any;
  isShowArr: boolean;
}) => {
  const { jsonKey, restProps, hierarchy, val, isShowArr } = props;

  return (
    <>
      {val.length > 0 &&
        isShowArr &&
        val.map((item: any, idx: Key | null | undefined) => {
          let isLast = idx === val.length - 1;
          return (
            <div
              style={indentStyle}
              className={classNames(jsonViewStyles.jsonViewArrayItem)}
              key={idx}
            >
              <JsonValue
                jsonKey={jsonKey}
                val={item}
                {...restProps}
                isIndex={false}
                indexField={undefined}
                hierarchy={hierarchy + 1}
              />
              {isLast ? "" : ","}
            </div>
          );
        })}
    </>
  );
};

/**
 * 渲染字段
 * @param key
 * @param val
 * @constructor
 */
type JsonValueProps = {
  jsonKey: string | undefined;
  val: any;
  isIndex?: boolean;
  indexField?: string;
  hierarchy: number;
} & _CommonProps;

const JsonValue = ({
  jsonKey,
  val,
  hierarchy,
  ...restProps
}: JsonValueProps) => {
  const {
    onClickValue,
    highLightValue,
    isIndex,
    indexField,
    onInsertExclusion,
  } = restProps;
  const [isShowArr, setIsShowArr] = useState<boolean>(false);

  let dom: JSX.Element = <></>;
  const highLightFlag = useMemo(() => {
    if (!highLightValue || ["object", "string"].includes(typeof val))
      return false;

    return !!highLightValue.find((item) => {
      if (
        item.key.search(".") !== -1 &&
        jsonKey === item.key.split(".")[1] &&
        item.value === val
      ) {
        return true;
      } else if (item.key === "_raw_log_" && item.value === `%${val}%`) {
        return true;
      }
      return (
        item.key.search(".") !== -1 &&
        jsonKey === item.key.split(".")[1] &&
        item.value === val
      );
    });
  }, [highLightValue, isShowArr, jsonKey, val]);

  switch (typeof val) {
    case "object":
      if (val instanceof Array) {
        dom = (
          <span className={classNames(jsonViewStyles.jsonViewValue)}>
            {val.length > 0 &&
              (isShowArr ? (
                <div className={classNames(jsonViewStyles.jsonViewIcon)}>
                  <CaretDownOutlined
                    onClick={() => setIsShowArr(() => !isShowArr)}
                  />
                </div>
              ) : (
                <div className={classNames(jsonViewStyles.jsonViewIcon)}>
                  <CaretRightOutlined
                    onClick={() => setIsShowArr(() => !isShowArr)}
                  />
                </div>
              ))}
            <span>[</span>
            {
              <JsonArr
                val={val}
                jsonKey={jsonKey}
                restProps={restProps}
                hierarchy={hierarchy + 1}
                isShowArr={isShowArr}
              />
            }
            {/* {val.length > 0 &&
              isShowArr &&
              val.map((item, idx) => {
                let isLast = idx === val.length - 1;
                return (
                  <div
                    style={indentStyle}
                    className={classNames(jsonViewStyles.jsonViewArrayItem)}
                    key={idx}
                  >
                    <JsonValue
                      jsonKey={jsonKey}
                      val={item}
                      {...restProps}
                      isIndex={false}
                      indexField={undefined}
                      hierarchy={hierarchy + 1}
                    />
                    {isLast ? "" : ","}
                  </div>
                );
              })} */}
            <span>]</span>
          </span>
        );
      } else if (val === null) {
        dom = (
          <span className={classNames(jsonViewStyles.jsonViewValue)}>null</span>
        );
      } else {
        dom = (
          <span className={classNames(jsonViewStyles.jsonViewValue)}>
            <JsonData data={val} {...restProps} hierarchy={hierarchy + 1} />
          </span>
        );
      }
      break;
    case "boolean":
      dom = (
        <span
          onClick={(e) => {
            // onClickValue?.(val.toString());
            e.stopPropagation();
          }}
          className={classNames(
            jsonViewStyles.jsonViewValue,
            jsonViewStyles.jsonViewValueHover,
            highLightFlag && jsonViewStyles.jsonViewHighlight
          )}
        >
          <ClickMenu
            field={jsonKey}
            content={val.toString()}
            handleAddCondition={() => onClickValue?.(val.toString())}
            handleOutCondition={() => onInsertExclusion?.(val.toString())}
          >
            <span>{val.toString()}</span>
          </ClickMenu>
        </span>
      );
      break;
    case "string":
      dom = (
        <span className={classNames(jsonViewStyles.jsonViewValue)}>
          "
          <JsonStringValue
            val={val}
            indexKey={indexField}
            onClickValue={onClickValue}
            {...restProps}
          />
          "
        </span>
      );
      break;
    case "number":
    case "bigint":
      dom = (
        <span
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={classNames(
            jsonViewStyles.jsonViewValue,
            jsonViewStyles.jsonViewValueHover,
            highLightFlag && jsonViewStyles.jsonViewHighlight
          )}
        >
          <ClickMenu
            field={jsonKey}
            content={val}
            handleAddCondition={() =>
              onClickValue?.(
                val.toString(),
                isIndex ? { isIndex, indexKey: indexField } : undefined
              )
            }
            handleOutCondition={() =>
              onInsertExclusion?.(
                val.toString(),
                isIndex ? { isIndex, indexKey: indexField } : undefined
              )
            }
          >
            <span>{val}</span>
          </ClickMenu>
        </span>
      );
      break;
  }
  return dom;
};

export default JsonValue;
