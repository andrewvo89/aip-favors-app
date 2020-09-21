import styled from 'styled-components';

const PageContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: ${(props) => (props.width ? props.width : '50%')};
`;

export default PageContainer;
