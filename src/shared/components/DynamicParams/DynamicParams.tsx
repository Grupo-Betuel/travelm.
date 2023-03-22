import { ParamEntity, ParamTypes } from '@shared/entities/ParamEntity'
import { Checkbox, Form, Input, Radio, Select } from 'antd'
import { SelectProps } from 'antd/es/select'
import { IFilterParam } from '@interfaces/params.interface'

export interface IDynamicParamProps {
  options?: string[]
  name?: string
}

const DynamicParamComponents: {
  [N in ParamTypes]: React.FC<IDynamicParamProps>
} = {
  SELECT: (props: IDynamicParamProps) => (
    <Select {...(props as SelectProps<any, any>)} />
  ),
  CHECKBOX: (props: IDynamicParamProps) => <Checkbox.Group {...props} />,
  RADIO: (props: IDynamicParamProps) => (
    <Radio.Group>
      {props.options?.map((option) => (
        <Radio.Button value={option} key={option}>
          {option}
        </Radio.Button>
      ))}
    </Radio.Group>
  ),
  INPUT: (props: IDynamicParamProps) => <Input {...props}></Input>,
}

export interface IDynamicParamsProps {
  params: ParamEntity[]
  renderType: 'searchParameterType' | 'responseParameterType'
  onChanges?: (filterParams: IFilterParam[]) => void
}
export const DynamicParams = ({
  params,
  renderType,
  onChanges,
}: IDynamicParamsProps) => {
  const handleDynamicChanges = (changeData: any, dynamicData?: any) => {
    const filterParams: IFilterParam[] = []
    Object.keys(dynamicData).forEach((k) => {
      if (!dynamicData[k]) return
      filterParams.push({
        paramId: k,
        answer: dynamicData[k],
      })
    })

    onChanges && onChanges(filterParams)
  }

  return (
    <Form
      name="createProduct"
      layout="vertical"
      onValuesChange={handleDynamicChanges}
      className="grid-column-fit-3"
    >
      {params.map((param: ParamEntity, i: number) => (
        <Form.Item
          className="d-flex-column mb-s"
          label={param.label}
          name={param._id}
          key={`${param.name}${i}`}
        >
          {DynamicParamComponents[param[renderType]]({
            options: param.options,
            name: param.name,
          })}
        </Form.Item>
      ))}
    </Form>
  )
}
