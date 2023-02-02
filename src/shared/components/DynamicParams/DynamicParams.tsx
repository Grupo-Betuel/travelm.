import styles from 'DynamicParams.module.scss'
import { ParamEntity, ParamTypes } from '@shared/entities/ParamEntity'
import { Button, Checkbox, Form, Input, Radio, Select } from 'antd'
import { IOption } from '@interfaces/common.intefacce'

export interface IDynamicParamProps {
  options?: IOption[]
  name?: string
}
const DynamicParamComponents: {
  [N in ParamTypes]: React.FC<IDynamicParamProps>
} = {
  SELECT: (props: IDynamicParamProps) => <Select {...props} />,
  CHECKBOX: (props: IDynamicParamProps) => <Checkbox.Group {...props} />,
  RADIO: (props: IDynamicParamProps) => (
    <Radio.Group>
      {props.options?.map((option) => (
        <Radio.Button value={option.value} key={option.value}>
          {option.label}
        </Radio.Button>
      ))}
    </Radio.Group>
  ),
  INPUT: (props: IDynamicParamProps) => <Input {...props}></Input>,
}

export const DynamicParams = () => {
  const params: ParamEntity[] = [
    {
      name: 'dynamic1',
      label: 'Dynamic Param 1',
      parameterType: 'CHECKBOX',
      options: ['Option 1', 'Option 2', 'Option 3'],
    },
    {
      name: 'dynamic2',
      label: 'Dynamic Param 2',
      parameterType: 'RADIO',
      options: [
        {
          value: 'mostRecent',
          label: 'Example 1',
        },
        {
          value: 'mostRecent2',
          label: 'Example 2',
        },
      ],
    },
    {
      name: 'dynamic3',
      label: 'Dynamic Param 3',
      parameterType: 'SELECT',
      options: [
        {
          value: 'mostRecent',
          label: 'Mas Recientes',
        },
        {
          value: 'mostRecent2',
          label: 'Mas Baratos',
        },
      ],
    },
    {
      name: 'dynamic4',
      label: 'Dynamic Param 4',
      parameterType: 'INPUT',
    },
  ]
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
        >
          {DynamicParamComponents[param.parameterType]({
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
