import { ParamEntity, ParamTypes } from '@shared/entities/ParamEntity'
import { Button, Checkbox, Form, Input, Radio, Select } from 'antd'
import { IOption } from '@interfaces/common.intefacce'
import { SelectProps } from 'antd/es/select'

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
}
export const DynamicParams = ({ params, renderType }: IDynamicParamsProps) => {
  const submit = (data: any) => console.log(data)

  return (
    <Form
      name="createProduct"
      layout="vertical"
      onFinish={submit}
      className="grid-column-fit-3"
    >
      {params.map((param: ParamEntity, i: number) => (
        <Form.Item
          className="d-flex-column mb-s"
          label={param.label}
          name={param.name}
          key={`${param.name}${i}`}
        >
          {DynamicParamComponents[param[renderType]]({
            options: param.options,
            name: param.name,
          })}
        </Form.Item>
      ))}
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
