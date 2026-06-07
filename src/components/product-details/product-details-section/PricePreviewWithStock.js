import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import {
	getAmountWithSign,
	getDiscountedAmount,
} from "../../../helper-functions/CardHelpers";

const PricePreviewWithStock = (props) => {
	const { state, theme, productDetailsData } = props;

	const priceWithOrWithoutDiscount = (price) => {
		return (
			<Typography
				marginTop="5px !important"
				display="flex"
				alignItems="center"
				fontWeight="700"
				color={theme.palette.primary.main}
				sx={{
					fontSize: { xs: "15px", sm: "24px" },
				}}
				component="h2"
			>
				{price ===
				getDiscountedAmount(
					price,
					state.modalData[0]?.discount,
					state.modalData[0]?.discount_type,
					state.modalData[0]?.store_discount
				) ? (
					<>{getAmountWithSign(price)}</>
				) : (
					<>
						{
							<>
								{getAmountWithSign(
									getDiscountedAmount(
										price,
										state.modalData[0]?.discount,
										state.modalData[0]?.discount_type,
										state.modalData[0]?.store_discount
									)
								)}
								<Typography
									variant="body1"
									marginLeft="8px"
									fontWeight="400"
									color={theme.palette.customColor.textGray}
									sx={{ fontSize: { xs: "13px", sm: "16px" } }}
								>
									<del>{getAmountWithSign(price)}</del>
								</Typography>
							</>
						}
					</>
				)}
			</Typography>
		);
	};
	const handlePriceRange = (priceOne, priceTwo) => {
		return (
			<Typography
				marginTop="5px !important"
				display="flex"
				alignItems="center"
				fontWeight="700"
				color={theme.palette.primary.main}
				sx={{
					fontSize: { xs: "15px", sm: "24px" },
				}}
			>
				{state?.modalData?.[0]?.discount === 0 ? (
					<>
						{priceOne > priceTwo ? (
							<>
								{`${getAmountWithSign(
									getDiscountedAmount(
										priceOne,
										state.modalData[0]?.discount,
										state.modalData[0]?.discount_type,
										state.modalData[0]?.store_discount
									)
								)} - ${getAmountWithSign(
									getDiscountedAmount(
										priceTwo,
										state.modalData[0]?.discount,
										state.modalData[0]?.discount_type,
										state.modalData[0]?.store_discount
									)
								)} `}
							</>
						) : (
							<>
								{`  ${getAmountWithSign(
									getDiscountedAmount(
										priceTwo,
										state.modalData[0]?.discount,
										state.modalData[0]?.discount_type,
										state.modalData[0]?.store_discount
									)
								)}-${getAmountWithSign(
									getDiscountedAmount(
										priceOne,
										state.modalData[0]?.discount,
										state.modalData[0]?.discount_type,
										state.modalData[0]?.store_discount
									)
								)} `}
							</>
						)}
					</>
				) : (
					<>
						{priceOne < priceTwo ? (
							<>{`${getAmountWithSign(
								getDiscountedAmount(
									priceOne,
									state.modalData[0]?.discount,
									state.modalData[0]?.discount_type,
									state.modalData[0]?.store_discount
								)
							)} - ${getAmountWithSign(
								getDiscountedAmount(
									priceTwo,
									state.modalData[0]?.discount,
									state.modalData[0]?.discount_type,
									state.modalData[0]?.store_discount
								)
							)} `}</>
						) : (
							<>
								{` ${getAmountWithSign(
									getDiscountedAmount(
										priceTwo,
										state.modalData[0]?.discount,
										state.modalData[0]?.discount_type,
										state.modalData[0]?.store_discount
									)
								)} -${getAmountWithSign(
									getDiscountedAmount(
										priceOne,
										state.modalData[0]?.discount,
										state.modalData[0]?.discount_type,
										state.modalData[0]?.store_discount
									)
								)}`}
							</>
						)}

						<Typography
							variant="body1"
							marginLeft="8px"
							fontWeight="400"
							color={theme.palette.customColor.textGray}
							sx={{ fontSize: { xs: "13px", sm: "16px" } }}
						>
							<del>
								{priceOne < priceTwo ? (
									<>
										{" "}
										{`${getAmountWithSign(
											priceOne
										)} - ${getAmountWithSign(priceTwo)}`}
									</>
								) : (
									<>
										{" "}
										{` ${getAmountWithSign(
											priceTwo
										)}-${getAmountWithSign(priceOne)} `}
									</>
								)}
							</del>
						</Typography>
					</>
				)}
			</Typography>
		);
	};
	const getUnitWeightPrice = () => {
		const unitWeightKG = Number(state?.modalData[0]?.unit_weight_kg);
		if (!(unitWeightKG > 0)) return null;
		const variations = state?.modalData[0]?.variations;
		if (!variations?.length) return null;

		let maxPriceVar = variations[0];
		variations.forEach(v => {
			if (v.price > maxPriceVar.price) maxPriceVar = v;
		});

		const weightMatch = maxPriceVar.type?.match(/(\d+)/);
		const weightGrams = weightMatch ? parseInt(weightMatch[1]) : 0;
		if (!(weightGrams > 0)) return null;

		return Math.round((maxPriceVar.price / weightGrams) * (unitWeightKG * 1000));
	};

	const handlePrice = () => {
		const unitPrice = getUnitWeightPrice();
		if (unitPrice !== null && state?.modalData[0]?.variations?.length > 0) {
			let minPrice = Infinity;
			state.modalData[0].variations.forEach(v => {
				if (v.price < minPrice) minPrice = v.price;
			});
			if (Number.parseInt(unitPrice) === Number.parseInt(minPrice)) {
				return <>{priceWithOrWithoutDiscount(unitPrice)}</>;
			}
			return (
				<Stack direction="row" alignItems="center">
					{handlePriceRange(unitPrice, minPrice)}
				</Stack>
			);
		}
		if (state?.modalData[0]?.variations?.length > 0) {
			if (
				Number.parseInt(state?.modalData[0]?.variations?.[0]?.price) ===
				Number.parseInt(
					state?.modalData[0]?.variations?.[
						state?.modalData[0]?.variations?.length - 1
					]?.price
				)
			) {
				return (
					<>
						{priceWithOrWithoutDiscount(
							state?.modalData[0]?.variations?.[0]?.price
						)}
					</>
				);
			} else {
				return (
					<Stack direction="row" alignItems="center">
						{handlePriceRange(
							state?.modalData[0]?.variations?.[0]?.price,
							state?.modalData[0]?.variations?.[
								state?.modalData[0]?.variations?.length - 1
							]?.price
						)}
					</Stack>
				);
			}
		} else {
			return <>{priceWithOrWithoutDiscount(state?.modalData[0]?.price)}</>;
		}
	};

	return <>{handlePrice()}</>;
};

PricePreviewWithStock.propTypes = {};

export default PricePreviewWithStock;
