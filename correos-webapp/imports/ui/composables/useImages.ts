import { ref } from 'vue'
import { Meteor } from 'meteor/meteor'
// @ts-ignore – vue-meteor-tracker does not ship types
import { useTracker } from 'vue-meteor-tracker'
import { Images } from '../../api/images/collection'
import { UploadFS } from 'meteor/jalik:ufs'
// @ts-ignore – store is JS, no types
import { ImagesStore } from '../../api/images/store'

export interface UseImages {
  modelo1: import('vue').Ref<string | null>
  modelo2: import('vue').Ref<string | null>
  uploadImage(dataUri: string, name: string): Promise<void>
}

/**
 * Convert a data URI (base64-encoded image) to a Blob suitable for upload.
 */
function dataURItoBlob(dataURI: string): Blob {
  const [meta, base64] = dataURI.split(',')
  const byteString = atob(base64)
  const mimeString = meta.split(':')[1].split(';')[0]

  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  return new Blob([ab], { type: mimeString })
}

/**
 * Composable for managing stamp model images (Modelo1 / Modelo2).
 * Provides reactive URLs for both models and an upload function that
 * handles crop-to-upload workflow via UploadFS (jalik:ufs).
 */
export function useImages(): UseImages {
  const modelo1 = ref<string | null>(null)
  const modelo2 = ref<string | null>(null)

  // Reactively track image documents from the Images collection
  useTracker(() => {
    const handle = Meteor.subscribe('images')
    if (!handle.ready()) return

    const img1 = Images.findOne({ name: 'Modelo1' }) as { url?: string } | undefined
    const img2 = Images.findOne({ name: 'Modelo2' }) as { url?: string } | undefined

    modelo1.value = img1?.url ?? null
    modelo2.value = img2?.url ?? null
  })

  /**
   * Upload an image (as data URI from a crop dialog) to the images collection.
   * Removes any existing image with the same name before uploading.
   *
   * @param dataUri - Base64-encoded data URI of the cropped image
   * @param name - Image name identifier ("Modelo1" or "Modelo2")
   */
  async function uploadImage(dataUri: string, name: string): Promise<void> {
    // Remove existing image with the same name on the server
    await new Promise<void>((resolve, reject) => {
      Meteor.call('removeImagesWithName', name, (error: Error | null) => {
        if (error) reject(error)
        else resolve()
      })
    })

    // Convert data URI to blob and upload via UploadFS
    const blob = dataURItoBlob(dataUri)
    const file = {
      name,
      type: blob.type,
      size: blob.size,
    }

    return new Promise<void>((resolve, reject) => {
      const upload = new UploadFS.Uploader({
        data: blob,
        file,
        store: ImagesStore,
        onError: (error: Error) => reject(error),
        onComplete: () => resolve(),
      })
      upload.start()
    })
  }

  return {
    modelo1,
    modelo2,
    uploadImage,
  }
}
