module ResumableHelper
	def setup_upload
		# the upload_token is for old DropLoad uploader
		session[:upload_token] = SecureRandom.uuid

		session.delete(:resumable_filenames)
		session.delete(:resumable_filepaths)
	end
end
