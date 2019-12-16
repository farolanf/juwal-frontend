import React from 'react'
import _ from 'lodash'

import { Modal, List } from 'semantic-ui-react'
import './category-picker.module.scss'

const CategoryPicker = ({ categories, selectedId, open, onClose, onChange }) => (
  <Modal open={open} onClose={onClose} closeIcon>
    <Modal.Header>Pilih Kategori</Modal.Header>
    <Modal.Content styleName='content'>
      {_.sortBy(categories, o => o.order).map(category => (
        <div key={category.id}>
          <List>
            <List.Item as='a' active={category.id === selectedId} onClick={() => onChange(category)}>
              <h5>{category.name}</h5>
            </List.Item>
            {_.sortBy(category.categories, o => o.order).map(child => (
              <List.Item key={child.id} as='a' active={child.id === selectedId} onClick={() => onChange(child)}>{child.name}</List.Item>
            ))}
          </List>
        </div>
      ))}
    </Modal.Content>
  </Modal>
)

export default CategoryPicker