'use server';
import { createClientServer } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
export interface ProjectInput {
  title: string;
  description: string;
  long_description?: string;
  tags: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
}
// Acción del Servidor para Crear un Proyecto (Protección Tokenizada integrada)
export async function createProject(formData: ProjectInput) {
const supabaseServer = await createClientServer();
const { data, error } = await supabaseServer
.from('projects')
.insert([formData])
.select()
.single();
if (error) {
throw new Error(`Error en mutación de base de datos: ${error.message}`);
}
// Purga instantánea de caché en la CDN de Next.js para actualizar la vista del Visualizador
revalidatePath('/');
return data;
}
// Acción del Servidor para Eliminar un Proyecto
export async function deleteProject(id: string) {
const supabaseServer = await createClientServer();
const { error } = await supabaseServer
.from('projects')
.delete()
.eq('id', id);
if (error) {
throw new Error(`Fallo al eliminar registro: ${error.message}`);
}
revalidatePath('/');
return { success: true };
}

export async function updateProject(id: string, formData: ProjectInput) {
const supabaseServer = await createClientServer();
const { data, error } = await supabaseServer
.from('projects')
.update(formData)
.eq('id', id)
.select()
.single();
if (error) {
throw new Error(`Fallo al actualizar registro: ${error.message}`);
}
revalidatePath('/');
return data;
}

// Acción del Servidor para Subir Imagen de Proyecto
export async function uploadProjectImage(formData: FormData) {
  const supabaseServer = await createClientServer();
  const file = formData.get('file') as File;

  if (!file) {
    throw new Error('No se proporcionó archivo');
  }

  // Validar que sea una imagen
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen');
  }

  // Limitar tamaño a 5MB
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('La imagen no puede exceder 5MB');
  }

  // Generar nombre único para la imagen
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  const fileName = `project-${timestamp}-${randomString}-${file.name}`;

  // Convertir File a Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Subir a Supabase Storage
  const { data, error } = await supabaseServer.storage
    .from('project-images')
    .upload(fileName, buffer, {
      contentType: file.type,
      cacheControl: '3600',
    });

  if (error) {
    throw new Error(`Error al subir imagen: ${error.message}`);
  }

  // Obtener URL pública
  const { data: publicUrlData } = supabaseServer.storage
    .from('project-images')
    .getPublicUrl(data.path);

  if (!publicUrlData.publicUrl) {
    throw new Error('No se pudo generar URL pública de la imagen');
  }

  return {
    url: publicUrlData.publicUrl,
    fileName: data.path,
  };
}