import axios from "axios";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";

type Inputs = {
  label: string;
  value: string;
  type?: string;
  input?: {
          name: string;
          value: string;
        }[];
  exampleRequired: string;
};
// type FormValues = {
//     input: {
//       name: string;
//       value: string;
//     }[];
//   };
const Form = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();


  const { fields, append, remove } = useFieldArray({
    label: "cart",
    control: Control<Inputs>
  });
  const onSubmit: SubmitHandler<Inputs> = (data) =>{
    console.log(data);
    append({
        label: data.label,
        value: data.value,
        type: data.type
      })
    delete data["type"]
    createForm(data);
  } 

  console.log(watch("label"), watch("value"), watch("type"));

  const createForm = (data: { label: string; value: string; exampleRequired: string; }) => {
    axios
      .post("http://localhost:3000", {
        data
      })
      .then((response) => {
        console.log(response);
      });
  };
  return (
    <>
      <h1>React Form Builder</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form-content">
        {/* register your input into the hook by invoking the "register" function */}
        <div className="">
          <div className="input-content">
            <label htmlFor="">Label</label>
            <input placeholder="Label" defaultValue="" {...register("label")} />
          </div>
          <div className="input-content">
            <label htmlFor="">Placeholder</label>
            <input
              placeholder="Placeholder"
              defaultValue=""
              {...register("value")}
            />
          </div>
          <div className="input-content">
            <label htmlFor="">Type</label>
            <select placeholder="Type" {...register("type")}>
              <option value="text">Text</option>
              <option value="date">Date</option>
              <option value="email">Email</option>
              <option value="textArea">TextArea</option>
            </select>
          </div>
        </div>

        {fields.map((field, index) => {
          return (
            <div key={field.id}>
              <section className={"section"} key={field.id}>
                <input
                  placeholder="name"
                  {...register(`input.${index}.name` as const, {
                    required: true
                  })}
                  className={errors?.input?.[index]?.name ? "error" : ""}
                  defaultValue={field.value}
                />
                <button type="button" onClick={() => remove(index)}>
                  DELETE
                </button>
              </section>
            </div>
          );
        })}
      
        {/* include validation with required or other standard HTML validation rules */}
        {/* <input {...register("exampleRequired", { required: true })} /> */}
        {/* errors will return when field validation fails  */}
        {errors.exampleRequired && <span>This field is required</span>}

        <input type="submit" className="submit" />
      </form>
    </>
  );
};

export default Form;
