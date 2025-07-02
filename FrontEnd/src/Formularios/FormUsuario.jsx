import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const FormularioUsuario = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [representantes, setRepresentantes] = useState([]);
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

    // Observar si se está ingresando una nueva contraseña
    const newPassword = watch("new_password");

    useEffect(() => {
        fetchRepresentantes();
        if (isEdit) fetchUsuario();
    }, [id]);

    const fetchRepresentantes = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/representantes/", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json();
            setRepresentantes(json.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUsuario = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/usuarios/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json();
            if (res.ok) {
                reset({
                    username: json.username,
                    fullname: json.fullname,
                    fk_representante: json.fk_representante
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const onSubmit = async (data) => {
        try {
            // Preparar los datos para enviar
            const submitData = {
                username: data.username,
                fullname: data.fullname,
                fk_representante: data.fk_representante
            };

            // Si es edición, siempre requerir contraseña actual
            if (isEdit) {
                if (!data.current_password) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Debe ingresar su contraseña actual para realizar cambios"
                    });
                    return;
                }
                submitData.current_password = data.current_password;

                // Solo incluir nueva contraseña si se ingresó
                if (data.new_password) {
                    submitData.new_password = data.new_password;
                }
            } else {
                // Si es creación, la contraseña es obligatoria
                if (!data.password) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "La contraseña es obligatoria para crear un usuario"
                    });
                    return;
                }
                submitData.password = data.password;
            }

            const res = await fetch(
                `http://localhost:5000/api/usuarios/${isEdit ? `update/${id}` : "create"}`,
                {
                    method: isEdit ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(submitData)
                }
            );
            const json = await res.json();

            if (res.ok) {
                await Swal.fire({
                    icon: "success",
                    title: "Éxito",
                    text: json.message || "Usuario guardado correctamente"
                });
                navigate("/usuarios");
            } else {
                throw new Error(json.message || "Error al guardar usuario");
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message
            });
        }
    };

    return (
        <div className="max-w-2xl mx-auto my-10 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-7 text-center">
                {isEdit ? "Editar Usuario" : "Registrar Usuario"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">Usuario</label>
                    <input
                        id="username"
                        {...register("username", { required: "Este campo es obligatorio" })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="Ingrese nombre de usuario"
                    />
                    {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>}
                </div>

                <div>
                    <label htmlFor="fullname" className="block text-sm font-semibold text-gray-700 mb-1">Nombre completo</label>
                    <input
                        id="fullname"
                        {...register("fullname", { required: "Este campo es obligatorio" })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="Ingrese nombre completo del usuario"
                    />
                    {errors.fullname && <p className="text-red-600 text-sm mt-1">{errors.fullname.message}</p>}
                </div>

                {/* Campo de contraseña para creación */}
                {!isEdit && (
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            {...register("password", { required: "Este campo es obligatorio" })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            placeholder="Ingrese una contraseña"
                        />
                        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                    </div>
                )}

                {/* Campos de contraseña para edición */}
                {isEdit && (
                    <>
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 mb-4">
                            <p className="text-sm">
                                <strong>Nota:</strong> Para realizar cualquier cambio, debe ingresar su contraseña actual.
                            </p>
                        </div>

                        <div>
                            <label htmlFor="current_password" className="block text-sm font-semibold text-gray-700 mb-1">
                                Contraseña actual <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                id="current_password"
                                {...register("current_password", { required: "La contraseña actual es obligatoria" })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="Ingrese su contraseña actual"
                            />
                            {errors.current_password && <p className="text-red-600 text-sm mt-1">{errors.current_password.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="new_password" className="block text-sm font-semibold text-gray-700 mb-1">
                                Nueva contraseña (opcional)
                            </label>
                            <input
                                type="password"
                                id="new_password"
                                {...register("new_password", {
                                    minLength: {
                                        value: 6,
                                        message: "La nueva contraseña debe tener al menos 6 caracteres"
                                    }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="Deje vacío si no desea cambiarla"
                            />
                            {errors.new_password && <p className="text-red-600 text-sm mt-1">{errors.new_password.message}</p>}
                        </div>

                        {newPassword && ( // Conditionally render confirm_new_password
                            <div>
                                <label htmlFor="confirm_new_password" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Confirmar nueva contraseña
                                </label>
                                <input
                                    type="password"
                                    id="confirm_new_password"
                                    {...register("confirm_new_password", {
                                        validate: value => value === newPassword || "Las contraseñas no coinciden"
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                    placeholder="Confirme la nueva contraseña"
                                />
                                {errors.confirm_new_password && <p className="text-red-600 text-sm mt-1">{errors.confirm_new_password.message}</p>}
                            </div>
                        )}
                    </>
                )}

                <div>
                    <label htmlFor="fk_representante" className="block text-sm font-semibold text-gray-700 mb-1">Representante</label>
                    <select
                        id="fk_representante"
                        {...register("fk_representante", { required: "Seleccione un representante" })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none"
                    >
                        <option value="">Seleccione...</option>
                        {representantes.map(r => (
                            <option key={r.id_representante} value={r.id_representante}>
                                {`${r.nombres} - ${r.cargo} (${r.junta})`}
                            </option>
                        ))}
                    </select>
                    {errors.fk_representante && <p className="text-red-600 text-sm mt-1">{errors.fk_representante.message}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                    >
                        {isEdit ? "Actualizar" : "Guardar"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioUsuario;