"use client";

import React, { useState, useEffect } from "react";
import { obtenerIdiomas, crearIdioma, actualizarIdioma, eliminarIdioma, obtenerIdiomaPredeterminado } from "../../lib/idiomas-db";
import type { Idioma } from "../../lib/idiomas-db";

const BANDERAS = [
  { emoji: "🇪🇨", nombre: "Ecuador" },
  { emoji: "🇪🇸", nombre: "España" },
  { emoji: "🇺🇸", nombre: "Estados Unidos" },
  { emoji: "🇬🇧", nombre: "Reino Unido" },
  { emoji: "🇫🇷", nombre: "Francia" },
  { emoji: "🇩🇪", nombre: "Alemania" },
  { emoji: "🇮🇹", nombre: "Italia" },
  { emoji: "🇵🇹", nombre: "Portugal" },
  { emoji: "🇧🇷", nombre: "Brasil" },
  { emoji: "🇯🇵", nombre: "Japón" },
  { emoji: "🇨🇳", nombre: "China" },
  { emoji: "🇷🇺", nombre: "Rusia" },
  { emoji: "🇦🇷", nombre: "Argentina" },
  { emoji: "🇨🇴", nombre: "Colombia" },
  { emoji: "🇲🇽", nombre: "México" },
  { emoji: "🇵🇪", nombre: "Perú" },
  { emoji: "🇨🇱", nombre: "Chile" },
  { emoji: "🇻🇪", nombre: "Venezuela" },
  { emoji: "🇺🇾", nombre: "Uruguay" },
  { emoji: "🇵🇾", nombre: "Paraguay" },
  { emoji: "🇧🇴", nombre: "Bolivia" },
  { emoji: "🇪🇨", nombre: "Ecuador" },
];

export default function IdiomasAdminPage() {
  const [idiomas, setIdiomas] = useState<Idioma[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIdioma, setEditingIdioma] = useState<Idioma | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    bandera: "🇪🇨",
    esPredeterminado: false,
    activo: true,
  });

  useEffect(() => {
    cargarIdiomas();
  }, []);

  const cargarIdiomas = async () => {
    setLoading(true);
    try {
      const data = await obtenerIdiomas();
      setIdiomas(data);
    } catch (error) {
      console.error("Error cargando idiomas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingIdioma(null);
    setFormData({
      nombre: "",
      codigo: "",
      bandera: "🇪🇨",
      esPredeterminado: false,
      activo: true,
    });
    setModalOpen(true);
  };

  const handleEdit = (idioma: Idioma) => {
    setEditingIdioma(idioma);
    setFormData({
      nombre: idioma.nombre,
      codigo: idioma.codigo,
      bandera: idioma.bandera,
      esPredeterminado: idioma.esPredeterminado,
      activo: idioma.activo,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este idioma?")) return;
    try {
      await eliminarIdioma(id);
      await cargarIdiomas();
    } catch (error) {
      console.error("Error eliminando idioma:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingIdioma) {
        await actualizarIdioma(editingIdioma.id!, formData);
      } else {
        await crearIdioma(formData);
      }
      setModalOpen(false);
      await cargarIdiomas();
    } catch (error) {
      console.error("Error guardando idioma:", error);
    }
  };

  const handleSetPredeterminado = async (idioma: Idioma) => {
    try {
      // Quitar predeterminado de todos
      for (const id of idiomas) {
        if (id.esPredeterminado && id.id !== idioma.id) {
          await actualizarIdioma(id.id!, { esPredeterminado: false });
        }
      }
      // Establecer nuevo predeterminado
      await actualizarIdioma(idioma.id!, { esPredeterminado: true });
      await cargarIdiomas();
    } catch (error) {
      console.error("Error estableciendo idioma predeterminado:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando idiomas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8" style={{ color: "#000000" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Idiomas</h1>
            <p className="text-gray-600 mt-2">Administra los idiomas disponibles para la tienda</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            + Agregar Idioma
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Bandera
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Predeterminado
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {idiomas.map((idioma) => (
                <tr key={idioma.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="text-3xl">{idioma.bandera}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{idioma.nombre}</td>
                  <td className="px-6 py-4 text-gray-600">{idioma.codigo}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        idioma.activo
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {idioma.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {idioma.esPredeterminado ? (
                      <span className="text-blue-600 font-semibold">✓ Predeterminado</span>
                    ) : (
                      <button
                        onClick={() => handleSetPredeterminado(idioma)}
                        className="text-gray-600 hover:text-blue-600 text-sm"
                      >
                        Establecer
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(idioma)}
                        className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(idioma.id!)}
                        className="text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {idiomas.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No hay idiomas configurados. Agrega el primero para comenzar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto" style={{ color: "#000000" }}>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingIdioma ? "Editar Idioma" : "Nuevo Idioma"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Idioma
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Español, Inglés, Francés"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código ISO
                    </label>
                    <input
                      type="text"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toLowerCase() })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: es, en, fr"
                      required
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bandera
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {BANDERAS.map((bandera) => (
                        <button
                          key={bandera.emoji}
                          type="button"
                          onClick={() => setFormData({ ...formData, bandera: bandera.emoji })}
                          className={`text-3xl p-2 rounded-lg border-2 transition-all ${
                            formData.bandera === bandera.emoji
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          title={bandera.nombre}
                        >
                          {bandera.emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.esPredeterminado}
                        onChange={(e) => setFormData({ ...formData, esPredeterminado: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Idioma predeterminado</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.activo}
                        onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Activo para selección pública</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingIdioma ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
