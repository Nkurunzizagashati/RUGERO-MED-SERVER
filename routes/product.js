import express from 'express';
import { multerUpload } from '../utils/multer.js';
import {
	addProduct,
	deleteProduct,
	getProducts,
	updateProduct,
} from '../controllers/product.js';
import {
	addProductValidator,
	updateProductValidator,
} from '../middlewares/products.js';
import { checkSchema } from 'express-validator';

const router = express.Router();

const uploadMiddleware = multerUpload().fields([
	{ name: 'image', maxCount: 1 },
]);

router.get('/', getProducts);

router.post(
	'/',
	uploadMiddleware,
	checkSchema(addProductValidator),
	addProduct
);
router.patch(
	'/:productId',
	uploadMiddleware,
	checkSchema(updateProductValidator),
	updateProduct
);
router.delete('/:productId', deleteProduct);

export default router;
