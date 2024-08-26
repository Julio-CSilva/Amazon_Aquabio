import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ModalHeader
} from "@chakra-ui/react";
import PeixeGaleria from "../../Home/B8_Galeria/PeixeGaleria";

const ModalZoom = ({ foto, aoFechar }) => {
  const { isOpen, onClose } = useDisclosure({
    isOpen: !!foto,
    onClose: aoFechar
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
      <ModalOverlay bg="rgba(0, 0, 0, 0.7)" />
      <ModalContent
        position="absolute"
        bg="#ffffff"
        p='1rem'
        w="150%"
        justifyContent="center"
      >
        <ModalHeader display="flex" alignItems="center" justifyContent="space-between" mb='0.25rem'>
          {foto ? foto.nome : 'null'}
          <ModalCloseButton position="relative" top="auto" right="auto" />
        </ModalHeader>
        <ModalBody p={0}>
          <PeixeGaleria
            foto={foto}
            expandida={true}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalZoom;
